"""
core/event_bus.py
EventBus synchrone — transposition directe du pattern JS.

Usage identique au JS :
    bus.subscribe('omdb:search', handler)
    bus.publish('omdb:search', payload)
    bus.unsubscribe('omdb:search', handler)
"""
from __future__ import annotations
from collections import defaultdict
from typing import Any, Callable


class EventBus:

    def __init__(self):
        self._listeners: dict[str, list[Callable]] = defaultdict(list)

    def subscribe(self, event: str, handler: Callable) -> None:
        if handler not in self._listeners[event]:
            self._listeners[event].append(handler)

    def unsubscribe(self, event: str, handler: Callable) -> None:
        try:
            self._listeners[event].remove(handler)
        except ValueError:
            pass

    def publish(self, event: str, payload: Any = None) -> None:
        for handler in list(self._listeners[event]):
            handler(payload)

    def once(self, event: str, handler: Callable) -> None:
        """S'abonne pour un seul déclenchement."""
        def wrapper(payload):
            handler(payload)
            self.unsubscribe(event, wrapper)
        self.subscribe(event, wrapper)

    def clear(self, event: str = None) -> None:
        if event:
            self._listeners[event].clear()
        else:
            self._listeners.clear()


# Instance globale — comme en JS :  import { bus } from '../../core/eventBus.js'
bus = EventBus()
