"""
Appointment helper
===================
Mirrors the public.appointments table in Supabase.
Used for type-safe construction and documentation — not ORM.
"""

from dataclasses import dataclass, field
from typing import Optional


# Valid status values (matches DB default + frontend transitions)
STATUSES = ("pending", "confirmed", "cancelled")


@dataclass
class Appointment:
    """
    Mirrors the public.appointments table.

    owner_id  →  auth.users.id  (set server-side from JWT, NOT from client body)
    vet_id    →  public.veterinarians.id
    file_path →  storage path  e.g.  {owner_id}/{filename}
    """
    owner_id:         str
    vet_id:           str
    pet_name:         str
    appointment_date: str           # ISO format: YYYY-MM-DD
    appointment_time: str           # HH:MM

    id:       Optional[str] = None
    pet_type: Optional[str] = None
    reason:   Optional[str] = None
    status:   str           = "pending"
    file_path: Optional[str] = None
    created_at: Optional[str] = None

    # Vet details joined in GET responses
    veterinarians: Optional[dict] = None

    def validate(self) -> list[str]:
        """Return a list of validation errors (empty = valid)."""
        errors = []
        if not self.owner_id:
            errors.append("owner_id is required")
        if not self.vet_id:
            errors.append("vet_id is required")
        if not self.pet_name:
            errors.append("pet_name is required")
        if not self.appointment_date:
            errors.append("appointment_date is required (YYYY-MM-DD)")
        if not self.appointment_time:
            errors.append("appointment_time is required (HH:MM)")
        if self.status not in STATUSES:
            errors.append(f"status must be one of: {STATUSES}")
        return errors

    @classmethod
    def from_dict(cls, data: dict) -> "Appointment":
        return cls(
            id               = data.get("id"),
            owner_id         = data.get("owner_id", ""),
            vet_id           = data.get("vet_id", ""),
            pet_name         = data.get("pet_name", ""),
            pet_type         = data.get("pet_type"),
            appointment_date = data.get("appointment_date", ""),
            appointment_time = data.get("appointment_time", ""),
            reason           = data.get("reason"),
            status           = data.get("status", "pending"),
            file_path        = data.get("file_path"),
            created_at       = data.get("created_at"),
            veterinarians    = data.get("veterinarians"),
        )

    def to_insert_dict(self) -> dict:
        """Return only the fields needed for a DB INSERT."""
        return {
            "owner_id":         self.owner_id,
            "vet_id":           self.vet_id,
            "pet_name":         self.pet_name,
            "pet_type":         self.pet_type,
            "appointment_date": self.appointment_date,
            "appointment_time": self.appointment_time,
            "reason":           self.reason,
            "status":           self.status,
        }
