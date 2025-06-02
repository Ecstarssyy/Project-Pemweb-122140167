from pyramid.view import view_config
from pyramid.response import Response
from .models import DBSession, Event, Participant
from sqlalchemy.orm.exc import NoResultFound
import json


def to_dict_event(event):
    return {
        'id': event.id,
        'name': event.name,
        'location': event.location,
        'participants': [
            {'id': p.id, 'name': p.name, 'email': p.email}
            for p in event.participants
        ]
    }


@view_config(route_name='get_events', renderer='json', request_method='GET')
def get_events(request):
    events = DBSession.query(Event).all()
    return [to_dict_event(e) for e in events]


@view_config(route_name='create_event', renderer='json', request_method='POST')
def create_event(request):
    try:
        data = request.json_body
        if not data.get('name'):
            return Response(json_body={'error': 'Name is required'}, status=400)
        event = Event(name=data['name'], location=data.get('location', ''))
        DBSession.add(event)
        DBSession.flush()
        return {'status': 'created', 'id': event.id}
    except Exception as e:
        return Response(json_body={'error': str(e)}, status=500)


@view_config(route_name='edit_event', renderer='json', request_method='GET')
def get_event(request):
    try:
        event_id = int(request.matchdict['id'])
        event = DBSession.query(Event).get(event_id)
        if not event:
            raise NoResultFound
        return to_dict_event(event)
    except NoResultFound:
        return Response(json_body={'error': 'Event not found'}, status=404)


@view_config(route_name='edit_event', renderer='json', request_method='PUT')
def update_event(request):
    try:
        event_id = int(request.matchdict['id'])
        event = DBSession.query(Event).get(event_id)
        if not event:
            return Response(json_body={'error': 'Event not found'}, status=404)
        
        data = request.json_body
        event.name = data.get('name', event.name)
        event.location = data.get('location', event.location)
        return {'status': 'updated', 'id': event.id}
    except Exception as e:
        return Response(json_body={'error': str(e)}, status=500)


@view_config(route_name='delete_event', renderer='json', request_method='DELETE')
def delete_event(request):
    try:
        event_id = int(request.matchdict['id'])
        event = DBSession.query(Event).get(event_id)
        if not event:
            raise NoResultFound
        DBSession.delete(event)
        return {'status': 'deleted'}
    except NoResultFound:
        return Response(json_body={'error': 'Event not found'}, status=404)


@view_config(route_name='get_participants', renderer='json', request_method='GET')
def get_participants(request):
    event_id = int(request.matchdict['id'])
    event = DBSession.query(Event).get(event_id)
    if not event:
        return Response(json_body={'error': 'Event not found'}, status=404)
    return [{'id': p.id, 'name': p.name, 'email': p.email} for p in event.participants]


@view_config(route_name='add_participant', renderer='json', request_method='POST')
def add_participant(request):
    try:
        data = request.json_body
        event_id = int(request.matchdict['id'])
        event = DBSession.query(Event).get(event_id)
        if not event:
            return Response(json_body={'error': 'Event not found'}, status=404)

        if not data.get('name'):
            return Response(json_body={'error': 'Name is required'}, status=400)

        participant = Participant(
            name=data['name'],
            email=data.get('email', ''),
            event=event
        )
        DBSession.add(participant)
        DBSession.flush()
        return {'status': 'participant added', 'id': participant.id}
    except Exception as e:
        return Response(json_body={'error': str(e)}, status=500)


@view_config(route_name='delete_participant', renderer='json', request_method='DELETE')
def delete_participant(request):
    try:
        pid = int(request.matchdict['pid'])
        p = DBSession.query(Participant).get(pid)
        if not p:
            raise NoResultFound
        DBSession.delete(p)
        return {'status': 'deleted'}
    except NoResultFound:
        return Response(json_body={'error': 'Participant not found'}, status=404)


# Handler OPTIONS untuk semua endpoint event utama
@view_config(route_name='get_events', request_method='OPTIONS')
@view_config(route_name='create_event', request_method='OPTIONS')
@view_config(route_name='edit_event', request_method='OPTIONS')
@view_config(route_name='delete_event', request_method='OPTIONS')
@view_config(route_name='add_participant', request_method='OPTIONS')
@view_config(route_name='delete_participant', request_method='OPTIONS')
def options_event(request):
    return Response(status=200)


