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
      title: "Bienvenido a TransCita Hub",
      description:
        "En 7 pasos rápidos te mostramos todo lo que puedes hacer: beneficios, actividades, descuentos y tu carnet digital. ¡Vamos!",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-beneficios"]',
    meta: { tab: "comunidad" },
    popover: {
      title: "Tab de Beneficios",
      description:
        "Aquí accedes a todas tus actividades y descuentos exclusivos como colaborador de TransCita.",
      side: "over",
      align: "center",
    },
  },
  {
    element: '[data-tour="actividades-section"]',
    meta: { tab: "comunidad" },
    popover: {
      title: "Actividades",
      description:
        "Aquí verás las actividades disponibles. Puedes ver la fecha, hora, lugar y cupo. Presiona 'Inscribirme' para participar.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="descuentos-section"]',
    meta: { tab: "comunidad" },
    popover: {
      title: "Descuentos Exclusivos",
      description:
        "Estos son tus descuentos exclusivos. Toca una tarjeta para expandirla, ver los detalles y redimir tu beneficio en el comercio.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="nav-perfil"]',
    meta: { tab: "perfil" },
    popover: {
      title: "Tab de Perfil",
      description:
        "En tu perfil puedes ver tu progreso e insignias. También encontrarás el botón 'Ver Carnet Digital' para abrir tu identificación oficial.",
      side: "over",
      align: "center",
    },
  },
  {
    element: '[data-tour="ver-carnet-btn"]',
    meta: { tab: "perfil" },
    popover: {
      title: "Abrir Carnet Digital",
      description:
        "Presiona este botón para abrir tu identificación digital oficial de TransCita.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="carnet-modal"]',
    meta: { openCarnet: true },
    popover: {
      title: "Tu Carnet Digital",
      description:
        "Esta es tu identificación oficial. Muestra tu foto, nombre, rol, hora oficial de Puerto Rico y tus logros. Muéstralo cuando lo necesites.",
      side: "left",
      align: "center",
    },
  },
  {
    popover: {
      title: "¡Ya estas listo!",
      description:
        "Conoces todo lo esencial de TransCita Hub. Explora tus beneficios, inscribete en actividades y lleva siempre tu carnet digital contigo. ¡Bienvenido al equipo!",
      align: "center",
    },
  },
];
