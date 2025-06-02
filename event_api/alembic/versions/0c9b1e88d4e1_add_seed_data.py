"""Add seed data

Revision ID: 0c9b1e88d4e1
Revises: da717d3d88e7
Create Date: 2025-06-01 05:07:44.459186

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0c9b1e88d4e1'
down_revision: Union[str, None] = 'da717d3d88e7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from event_api.models import Participant, Event
    from sqlalchemy.orm import Session
    bind = op.get_bind()
    session = Session(bind=bind)

    event = Event(name="Tech Conference", location="Jakarta")
    session.add(event)
    session.flush()  # untuk dapat ID

    participant = Participant(name="Nash", email="nash@example.com", event_id=event.id)
    session.add(participant)
    session.commit()


def downgrade() -> None:
    bind = op.get_bind()
    session = Session(bind=bind)
    session.execute("DELETE FROM participants")
    session.execute("DELETE FROM events")
    session.commit()
