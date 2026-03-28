import type { DriveStep } from "driver.js";

export interface TourStepMeta {
  tab?: string;
  openCarnet?: boolean;
  closeCarnet?: boolean;
}

export interface TourStep extends DriveStep {
  meta?: TourStepMeta;
}

export const tourSteps: TourStep[] = [
  {
    popover: {
      title: "Bienvenido al Tour de TransCita Hub",
      description:
        "Te mostraremos cómo aprovechar tus beneficios exclusivos y cómo utilizar tu carnet digital. ¡Comencemos!",
    },
  },
  {
    element: '[data-tour="nav-beneficios"]',
    meta: { tab: "comunidad" },
    popover: {
      title: "Tab de Beneficios",
      description:
        "Aquí accedes a todas tus actividades y descuentos exclusivos como colaborador de TransCita.",
      side: "top",
    },
  },
  {
    element: '[data-tour="beneficios-header"]',
    meta: { tab: "comunidad" },
    popover: {
      title: "Tus Beneficios",
      description:
        "Esta sección muestra todos los beneficios disponibles para ti: actividades y descuentos exclusivos.",
    },
  },
  {
    element: '[data-tour="actividades-section"]',
    meta: { tab: "comunidad" },
    popover: {
      title: "Actividades",
      description:
        "Aquí verás las actividades disponibles. Puedes ver la fecha, hora, lugar y cupo. Presiona 'Inscribirme' para participar.",
    },
  },
  {
    element: '[data-tour="descuentos-section"]',
    meta: { tab: "comunidad" },
    popover: {
      title: "Descuentos Exclusivos",
      description:
        "Estos son tus descuentos exclusivos. Toca una tarjeta para expandirla, ver los detalles y redimir tu beneficio en el comercio.",
    },
  },
  {
    element: '[data-tour="nav-perfil"]',
    meta: { tab: "perfil" },
    popover: {
      title: "Tab de Perfil",
      description:
        "En tu perfil puedes ver tu progreso, insignias y acceder a tu carnet digital.",
      side: "top",
    },
  },
  {
    element: '[data-tour="ver-carnet-btn"]',
    meta: { tab: "perfil" },
    popover: {
      title: "Abrir Carnet Digital",
      description:
        "Presiona este botón para abrir tu identificación digital oficial de TransCita.",
    },
  },
  {
    element: '[data-tour="carnet-modal"]',
    meta: { openCarnet: true },
    popover: {
      title: "Tu Carnet Digital",
      description:
        "Esta es tu identificación oficial. Muestra tu foto, nombre, rol, hora oficial de Puerto Rico y tus logros. Muéstralo cuando lo necesites.",
    },
  },
];
