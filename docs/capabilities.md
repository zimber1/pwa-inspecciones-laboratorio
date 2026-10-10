# Capacidades del dispositivo y notificaciones

## Alcance individual de Cesar

La asignacion individual de Cesar Gaspar Pacheco para Semana 06 se concentra en
`src/lib/notifications/client.ts`. Camara y geolocalizacion forman parte del
alcance del equipo, pero no fueron implementadas en esta rama para evitar
invadir archivos asignados a otros integrantes.

## Politica de permisos

La funcion `requestNotificationPermission` solo solicita permisos cuando recibe
`userInitiated: true`. Esta restriccion representa el requisito de pedir permiso
desde una accion clara del usuario, por ejemplo un boton dentro de la PWA.

Si la llamada no proviene de una accion del usuario, la funcion no invoca
`Notification.requestPermission()` y devuelve un fallback con la razon
`requires-user-action`.

## Comportamiento cubierto

- Permiso concedido: se permite mostrar la notificacion con la API nativa.
- Permiso denegado: se conserva el flujo mediante un mensaje interno de fallback.
- Permiso en `default`: no se fuerza la notificacion; se informa fallback.
- API no disponible: la aplicacion sigue funcionando con aviso interno.
- Error al solicitar permiso o crear notificacion: se captura el error y se
  devuelve un resultado controlado.

## Fallback funcional

Cuando las notificaciones no pueden usarse, la funcion devuelve un mensaje para
mostrar dentro de la aplicacion:

```text
Notificacion no disponible. El cambio quedo visible dentro de la aplicacion.
```

Esto evita que el registro de una inspeccion dependa de permisos del navegador.
La notificacion es una mejora progresiva, no un requisito para completar el
flujo.

## Privacidad y datos sinteticos

Las pruebas usan identificadores sinteticos como `INS-SYN-006`. No se incluyen
credenciales, llaves privadas, ubicaciones reales, nombres reales de estudiantes
ni datos personales. El cuerpo de la notificacion debe mantenerse breve y no
debe exponer informacion sensible.

## Prueba

`tests/capabilities.spec.ts` verifica el contrato de notificaciones:

- API no disponible;
- solicitud bloqueada si no hay accion de usuario;
- permiso concedido;
- permiso denegado;
- error al pedir permiso;
- error al crear la notificacion;
- fallback funcional.

Comando:

```bash
npm test
```

## Limites

La implementacion no registra push remoto ni utiliza un servidor de
notificaciones. Solo cubre notificaciones locales del navegador y fallback. La
integracion con camara y geolocalizacion queda pendiente de la rama de los
integrantes responsables de esos archivos.
