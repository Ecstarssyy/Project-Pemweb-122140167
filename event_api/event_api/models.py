from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from sqlalchemy import (
    Column, Integer, String, ForeignKey, create_engine
)
from zope.sqlalchemy import register

DBSession = scoped_session(sessionmaker())
register(DBSession)
Base = declarative_base()

class Event(Base):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String)
    participants = relationship("Participant", back_populates="event", cascade="all, delete")

class Participant(Base):
    __tablename__ = 'participants'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String)
    event_id = Column(Integer, ForeignKey('events.id'))
    event = relationship("Event", back_populates="participants")