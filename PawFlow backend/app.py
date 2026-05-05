"""
PawFlow / Veto-Care  —  Flask Backend
======================================
All Supabase credentials come from the .env file — NEVER hard-coded.

Endpoints:
  POST   /signup                          → Register new user
  POST   /login                           → Login, returns JWT token
  POST   /logout                          → Invalidate session
  GET    /profile                         → Get current user's profile
  PATCH  /profile                         → Update current user's profile
  GET    /vets                            → List all veterinarians
  GET    /appointments                    → List user's own appointments (RLS enforced)
  POST   /appointments                    → Create a new appointment
  PATCH  /appointments/<id>              → Update appointment status
  DELETE /appointments/<id>              → Cancel/delete an appointment
  POST   /appointments/<id>/upload       → Upload a pet health record file
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from supabase.client import ClientOptions
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# ── Load .env FIRST — before any os.environ.get() call ──────────────
load_dotenv()

app = Flask(__name__)

# ── CORS — allow the frontend (any origin in dev, restrict in prod) ──────
# In production, replace "*" with your actual frontend domain:
# e.g. CORS(app, origins=["https://your-app.vercel.app"])
CORS(app, origins="*", supports_credentials=True)

# ── Supabase Configuration ────────────────────────────────────────────
# Values come from .env — no fallback strings (fail fast if misconfigured)
SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_KEY: str = os.environ["SUPABASE_KEY"]

# Shared anon client (used only for auth operations that don't need RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# ─────────────────────────────────────────────────────────────────────
# Helper: build an authenticated Supabase client from the user's JWT.
# This is what makes RLS work — every DB/Storage call goes through the
# user's token so Supabase can apply the per-row security policies.
# ─────────────────────────────────────────────────────────────────────
def authed_client(token: str) -> Client:
    """Return a Supabase client that acts as the authenticated user.
    Passing the JWT via headers makes every DB/Storage call go through
    the user's identity, so RLS policies are applied correctly.
    """
    client = create_client(
        SUPABASE_URL,
        SUPABASE_KEY,
        options=ClientOptions(
            postgrest_client_timeout=10,
            storage_client_timeout=10,
        ),
    )
    # Inject the user's JWT so Supabase RLS knows who is making the request
    client.postgrest.auth(token)
    client.storage.session.headers.update({"Authorization": f"Bearer {token}"})
    return client


def extract_token(req) -> str | None:
    """Pull the Bearer token from the Authorization header."""
    header = req.headers.get("Authorization", "")
    if header.startswith("Bearer "):
        return header[len("Bearer "):]
    return None


def require_auth(req):
    """Return (token, None) or (None, error_response)."""
    token = extract_token(req)
    if not token:
        return None, (jsonify({"error": "Missing or invalid Authorization header"}), 401)
    return token, None


# ══════════════════════════════════════════════════════════════════════
# AUTH ENDPOINTS
# ══════════════════════════════════════════════════════════════════════

@app.route("/signup", methods=["POST"])
def signup():
    """
    Body (JSON):
      { "email": "...", "password": "...", "full_name": "...", "phone": "..." }
    """
    body = request.get_json(silent=True) or {}
    email     = body.get("email")
    password  = body.get("password")
    full_name = body.get("full_name", "")
    phone     = body.get("phone", "")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    try:
        res = supabase.auth.sign_up({
            "email":    email,
            "password": password,
            "options":  {"data": {"full_name": full_name}},
        })

        # The trigger in supabase_schema.sql auto-creates the profile row.
        # We also update phone here since the trigger only sets full_name.
        if res.user and phone:
            supabase.table("profiles").update({"phone": phone}).eq("id", res.user.id).execute()

        return jsonify({
            "message": "Account created. Check your email to confirm.",
            "user_id": res.user.id if res.user else None,
        }), 201

    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/login", methods=["POST"])
def login():
    """
    Body (JSON):
      { "email": "...", "password": "..." }
    Returns:
      { "access_token": "...", "user": { ... } }
    """
    body     = request.get_json(silent=True) or {}
    email    = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    try:
        res = supabase.auth.sign_in_with_password({"email": email, "password": password})
        return jsonify({
            "message":      "Login successful",
            "access_token": res.session.access_token,
            "user": {
                "id":    res.user.id,
                "email": res.user.email,
            },
        }), 200

    except Exception as exc:
        return jsonify({"error": str(exc)}), 401


@app.route("/logout", methods=["POST"])
def logout():
    token, err = require_auth(request)
    if err:
        return err
    try:
        # Use authed_client so Supabase revokes THIS user's session, not the anon session
        client = authed_client(token)
        client.auth.sign_out()
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


# ══════════════════════════════════════════════════════════════════════
# PROFILE ENDPOINTS
# ══════════════════════════════════════════════════════════════════════

@app.route("/profile", methods=["GET"])
def get_profile():
    token, err = require_auth(request)
    if err:
        return err
    try:
        user_res  = supabase.auth.get_user(token)
        owner_id  = user_res.user.id
        client    = authed_client(token)
        res       = client.table("profiles").select("*").eq("id", owner_id).single().execute()
        return jsonify(res.data), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/profile", methods=["PATCH"])
def update_profile():
    """
    Body (JSON): { "full_name": "...", "phone": "..." }
    """
    token, err = require_auth(request)
    if err:
        return err
    body = request.get_json(silent=True) or {}
    try:
        user_res = supabase.auth.get_user(token)
        owner_id = user_res.user.id
        client   = authed_client(token)
        res      = client.table("profiles").update(body).eq("id", owner_id).execute()
        return jsonify({"message": "Profile updated", "data": res.data}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


# ══════════════════════════════════════════════════════════════════════
# VETERINARIANS  (Table B)
# ══════════════════════════════════════════════════════════════════════

@app.route("/vets", methods=["GET"])
def get_vets():
    token, err = require_auth(request)
    if err:
        return err
    try:
        client = authed_client(token)
        res    = client.table("veterinarians").select("id, name, specialty, avatar_url").execute()
        return jsonify(res.data), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


# ══════════════════════════════════════════════════════════════════════
# APPOINTMENTS  (Table C)
# ══════════════════════════════════════════════════════════════════════

@app.route("/appointments", methods=["GET"])
def get_appointments():
    """
    Returns the logged-in user's appointments only.
    RLS on the DB ensures no cross-user data leaks even if something goes wrong.
    """
    token, err = require_auth(request)
    if err:
        return err
    try:
        client = authed_client(token)
        res    = (
            client.table("appointments")
            .select("*, veterinarians(name, specialty)")
            .order("appointment_date", desc=False)
            .execute()
        )
        return jsonify(res.data), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/appointments", methods=["POST"])
def create_appointment():
    """
    Body (JSON):
      {
        "vet_id":           "uuid",
        "pet_name":         "Buddy",
        "pet_type":         "Dog",
        "appointment_date": "2026-06-15",
        "appointment_time": "10:00",
        "reason":           "Annual check-up"
      }
    """
    token, err = require_auth(request)
    if err:
        return err

    body = request.get_json(silent=True) or {}
    required = ["vet_id", "pet_name", "appointment_date", "appointment_time"]
    missing  = [f for f in required if not body.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        user_res = supabase.auth.get_user(token)
        owner_id = user_res.user.id
        client   = authed_client(token)

        # ── Double-booking guard ──────────────────────────────────────────
        # Check if the same vet already has an appointment at the requested slot.
        # The DB UNIQUE constraint (no_double_booking) also catches this at the
        # database level, but we return a friendly message here.
        conflict = (
            client.table("appointments")
            .select("id")
            .eq("vet_id", body["vet_id"])
            .eq("appointment_date", body["appointment_date"])
            .eq("appointment_time", body["appointment_time"])
            .neq("status", "cancelled")      # cancelled slots are freed up
            .execute()
        )
        if conflict.data:
            return jsonify({
                "error": "This time slot is already booked for the selected vet. Please choose a different time."
            }), 409
        # ─────────────────────────────────────────────────────────────────

        record = {
            "owner_id":         owner_id,
            "vet_id":           body["vet_id"],
            "pet_name":         body["pet_name"],
            "pet_type":         body.get("pet_type"),
            "appointment_date": body["appointment_date"],
            "appointment_time": body["appointment_time"],
            "reason":           body.get("reason"),
            "status":           "pending",
        }

        res = client.table("appointments").insert(record).execute()
        return jsonify({"message": "Appointment created", "data": res.data}), 201

    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/appointments/<appointment_id>", methods=["PATCH"])
def update_appointment(appointment_id: str):
    """
    Body (JSON): { "status": "confirmed" }  (or any updatable fields)
    RLS ensures the user can only update their OWN appointments.
    """
    token, err = require_auth(request)
    if err:
        return err

    body = request.get_json(silent=True) or {}
    if not body:
        return jsonify({"error": "Request body is empty"}), 400

    try:
        client = authed_client(token)
        res    = (
            client.table("appointments")
            .update(body)
            .eq("id", appointment_id)
            .execute()
        )
        return jsonify({"message": "Appointment updated", "data": res.data}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/appointments/<appointment_id>", methods=["DELETE"])
def delete_appointment(appointment_id: str):
    """
    RLS ensures user can only delete their OWN appointments.
    """
    token, err = require_auth(request)
    if err:
        return err
    try:
        client = authed_client(token)
        client.table("appointments").delete().eq("id", appointment_id).execute()
        return jsonify({"message": "Appointment deleted"}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


# ══════════════════════════════════════════════════════════════════════
# STORAGE — upload pet health record
# ⚠️  This route MUST be registered BEFORE /appointments/<appointment_id>
#     so Flask doesn't interpret "upload" as the appointment_id parameter.
# ══════════════════════════════════════════════════════════════════════

@app.route("/appointments/<appointment_id>/upload", methods=["POST"])
def upload_pet_record(appointment_id: str):
    """
    Form-data: file=<binary>
    Stores the file in the 'pet_records' bucket under {owner_id}/{appointment_id}/{filename}.
    Then saves the storage path in appointments.file_path.
    """
    token, err = require_auth(request)
    if err:
        return err

    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Only allow safe file types
    ALLOWED_EXTENSIONS = {"pdf", "jpg", "jpeg", "png"}
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"error": f"File type '.{ext}' not allowed. Use: {ALLOWED_EXTENSIONS}"}), 400

    try:
        user_res     = supabase.auth.get_user(token)
        owner_id     = user_res.user.id
        filename     = secure_filename(file.filename)
        # Namespace by owner_id/appointment_id to avoid filename collisions
        storage_path = f"{owner_id}/{appointment_id}/{filename}"
        client       = authed_client(token)

        # Verify the appointment belongs to this user before uploading
        appt_check = (
            client.table("appointments")
            .select("id")
            .eq("id", appointment_id)
            .eq("owner_id", owner_id)
            .execute()
        )
        if not appt_check.data:
            return jsonify({"error": "Appointment not found or access denied"}), 404

        # Upload to Supabase Storage
        file_bytes = file.read()
        client.storage.from_("pet_records").upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": file.content_type, "upsert": "true"},
        )

        # Save path on the appointment row (RLS ensures this is the owner's row)
        update_res = (
            client.table("appointments")
            .update({"file_path": storage_path})
            .eq("id", appointment_id)
            .execute()
        )

        return jsonify({
            "message":     "File uploaded successfully",
            "file_path":   storage_path,
            "appointment": update_res.data,
        }), 200

    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


# ══════════════════════════════════════════════════════════════════════
# APPOINTMENTS — update and delete (registered AFTER /upload)
# ══════════════════════════════════════════════════════════════════════


# ══════════════════════════════════════════════════════════════════════
# HEALTH CHECK — used by Vercel and monitoring tools
# ══════════════════════════════════════════════════════════════════════

@app.route("/health", methods=["GET"])
def health():
    """Quick liveness check — no auth needed."""
    return jsonify({"status": "ok", "project": "PawFlow / Veto-Care"}), 200


# ══════════════════════════════════════════════════════════════════════
# Run
# ══════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    # debug=False in production; set HOST/PORT via env if needed
    app.run(debug=True, host="0.0.0.0", port=5000)
