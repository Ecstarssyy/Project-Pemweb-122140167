def includeme(config):
    config.add_route('get_events', '/events')
    config.add_route('create_event', '/events/create')
    config.add_route('edit_event', '/events/edit/{id}')
    config.add_route('delete_event', '/events/delete/{id}')
    config.add_route('options_create_event', '/events/create', request_method='OPTIONS')
    config.add_route('options_edit_event', '/events/edit/{id}', request_method='OPTIONS')
    config.add_route('options_delete_event', '/events/delete/{id}', request_method='OPTIONS')

    config.add_route('get_participants', '/participants/get/{id}')
    config.add_route('add_participant', '/participants/create/{id}')
    config.add_route('delete_participant', '/participants/delete/{pid}')
    config.add_route('options_add_participant', '/participants/create/{id}', request_method='OPTIONS')
    config.add_route('options_delete_participant', '/participants/delete/{pid}', request_method='OPTIONS')