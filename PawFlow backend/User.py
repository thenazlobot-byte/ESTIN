"""
User / Profile helper
======================
With Supabase, users are managed by Supabase Auth (auth.users).
We don't need SQLAlchemy — this file provides clean dataclass
representations to validate and document what a profile looks like.
"""

from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Profile:
    """
    Mirrors the public.profiles table in Supabase.
    id  →  same UUID as auth.users.id  (set by the DB trigger automatically)
    """
    id:         str           # UUID from auth.users
    full_name:  str  = ""
    phone:      str  = ""
    created_at: str  = ""

    @classmethod
    def from_dict(cls, data: dict) -> "Profile":
        return cls(
            id=data.get("id", ""),
            full_name=data.get("full_name", ""),
            phone=data.get("phone", ""),
            created_at=data.get("created_at", ""),
        )

    def to_dict(self) -> dict:
        return {
            "id":         self.id,
            "full_name":  self.full_name,
            "phone":      self.phone,
            "created_at": self.created_at,
        }
