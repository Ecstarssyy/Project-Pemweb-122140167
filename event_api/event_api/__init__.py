from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .models import DBSession, Base
from pyramid.response import Response

def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = '*'
        response.headers['Access-Control-Allow-Headers'] = '*'
        return response
    event.request.add_response_callback(cors_headers)

def options_view(request):
    return Response(status=200)

def main(global_config, **settings):
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.create_all(engine)

    config = Configurator(settings=settings)
    config.include('pyramid_tm')
    config.include('.routes', route_prefix='/api')
    config.scan('.views')
    config.add_subscriber(add_cors_headers_response_callback, 'pyramid.events.NewRequest')
    config.add_route('options', '/api/*subpath')
    config.add_view(options_view, route_name='options', request_method='OPTIONS')

    return config.make_wsgi_app()