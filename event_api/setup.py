from setuptools import setup

setup(
    name='event_api',
    packages=['event_api'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'pyramid',
        'sqlalchemy',
        'pyramid_tm',
        'zope.sqlalchemy',
        'waitress',
        'psycopg2-binary'
    ],
    entry_points={
        'paste.app_factory': [
            'main = event_api:main'
        ],
    },
)