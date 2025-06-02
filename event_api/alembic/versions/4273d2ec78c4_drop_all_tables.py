"""drop all tables

Revision ID: 4273d2ec78c4
Revises: 0c9b1e88d4e1
Create Date: 2025-06-01 06:08:38.924757

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4273d2ec78c4'
down_revision: Union[str, None] = '0c9b1e88d4e1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
