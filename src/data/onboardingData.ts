import { OnboardingSection } from "../components/LMSSectionViewer";

export interface TrainingProgram {
    id: string;
    title: string;
    description: string;
    emoji: string;
    sections: OnboardingSection[];
}

const ONBOARDING_SECTIONS: OnboardingSection[] = [
    {
        id: 'bienvenida',
        title: '¡Bienvenidos!',
        type: 'presentation',
        thumbnail: '/assets/branding/image5.png',
        slides: [
            {
                title: '¡Bienvenido al Equipo TransCita!',
                body: 'Estamos emocionados de que formes parte de nuestro equipo. Tu labor es fundamental para asegurar la salud y el bienestar de nuestra comunidad.'
            },
            {
                title: 'TransCita: Líderes en Transportación Médica No Emergente',
                body: '<strong>Fundada en el 2008</strong>, TransCita se ha consolidado como la <strong>compañía de NEMT más grande de Puerto Rico</strong>, con una presencia incomparable en toda la isla para servir mejor a nuestros pasajeros.'
            },
            {
                title: 'Nuestra Capacidad Operativa',
                body: 'Contamos con una <strong>flota de más de 458 vehículos</strong> y un equipo de <strong>más de 769 empleados</strong> comprometidos con la excelencia en el servicio. Realizamos <strong>más de 2,391 viajes al día</strong> a través de aproximadamente <strong>490 rutas diarias</strong>.'
            },
            {
                title: 'Presencia en Puerto Rico',
                body: 'Tenemos <strong>23 bases estratégicamente ubicadas a través de Puerto Rico</strong>. Ninguna otra compañía NEMT tiene más ubicaciones en Puerto Rico, lo que nos permite brindar un servicio rápido y accesible a toda la isla.'
            }
        ]
    },
    {
        id: 'mision',
        title: 'Nuestra Misión',
        type: 'presentation',
        thumbnail: '/assets/branding/image2.png',
        slides: [
            {
                title: 'Misión Institucional',
                body: 'Contribuir a la calidad de vida de nuestros clientes, proveyendo acceso a servicios de salud de forma segura, eficiente y puntual, asegurando la más alta calidad de servicio y tecnología de vanguardia.'
            }
        ]
    },
    {
        id: 'valores',
        title: 'Nuestros Valores',
        type: 'presentation',
        thumbnail: '/assets/branding/transcita-logo-valores.png',
        slides: [
            {
                title: 'Compromiso Social',
                body: 'Con nuestro trabajo diario aportamos a mejorar la <strong>calidad de vida de nuestra comunidad</strong>.'
            },
            {
                title: 'Trabajo en Equipo',
                body: 'Colaboramos con el grupo de trabajo fomentando la <strong>comunicación abierta</strong> y el intercambio de ideas para lograr las metas establecidas.'
            },
            {
                title: 'Excelencia en Servicio',
                body: 'Nos desempeñamos con estándares de <strong>calidad superior</strong> y enfocándonos en la satisfacción de nuestros clientes.'
            },
            {
                title: 'Innovación',
                body: 'Buscamos ideas nuevas y conceptos orientados a la <strong>eficiencia y satisfacción</strong> de nuestros clientes.'
            },
            {
                title: 'Lealtad',
                body: 'Somos <strong>fieles a nuestras obligaciones</strong> como equipo de trabajo, acuerdos de labores, políticas y principios de servicio.'
            },
            {
                title: 'Liderazgo',
                body: 'Somos capaces de tomar decisiones acertadas para el equipo y clientes. <strong>Inspiramos a otros</strong> a alcanzar las metas. Influenciamos positivamente las actitudes y comportamientos para trabajar por un objetivo común.'
            }
        ]
    },
    {
        id: 'viajar-transcita',
        title: '¿Cómo es viajar con TransCita?',
        type: 'video',
        thumbnail: '/assets/branding/image10.png',
        videoUrl: '/media/corporativo.mov',
        content: 'Descubre la experiencia de mobility y cuidado que ofrecemos a nuestros pasajeros.'
    },
    {
        id: 'nuestros-servicios',
        title: 'Nuestros Servicios',
        type: 'presentation',
        thumbnail: '/assets/branding/image10.png',
        slides: [
            {
                title: 'Servicios de Salud Especializados',
                body: 'TransCita ofrece dos modalidades principales de servicio: <strong>TransCita Salud</strong> y <strong>TransCita Privado</strong>.'
            },
            {
                title: 'TransCita Salud - Planes Médicos Vital',
                body: 'El proveedor debe completar una <strong>solicitud de transporte no emergente</strong>. La solicitud se debe enviar vía correo electrónico a operations@transcita.com.'
            },
            {
                title: 'TransCita Salud - Planes Médicos Advantage',
                body: 'El beneficio depende del producto que tenga el paciente. Se debe solicitar el transporte con <strong>3 días laborables de antelación</strong>.'
            },
            {
                title: 'TransCita Privado',
                body: 'El servicio es exclusivo o colectivo para el pasajero. El servicio es por <strong>pago directo</strong>: tarjeta de crédito, ATH Móvil o tarjeta prepagada TransCita.'
            }
        ]
    },
    {
        id: 'organigrama',
        title: 'Nuestro Organigrama',
        type: 'presentation',
        thumbnail: '/assets/branding/image11.png',
        slides: [
            {
                title: 'Estructura Organizacional',
                body: 'Conoce a los líderes y la estructura que hace posible nuestra operación diaria.'
            }
        ]
    },
    {
        id: 'dept-transportacion',
        title: 'Departamento de Transportación',
        type: 'video',
        thumbnail: '/assets/branding/image6.png',
        videoUrl: '/media/transportacion.mov',
        content: '¿Cómo nos apoyamos en el día a día para lograr nuestras metas?'
    },
    {
        id: 'dept-logistica',
        title: 'Departamento de Logística',
        type: 'video',
        thumbnail: '/assets/branding/image7.png',
        videoUrl: '/media/logistica.mov',
        content: 'Sincronización y eficiencia en cada ruta.'
    },
    {
        id: 'servicio-pasajero',
        title: 'Servicio al Pasajero',
        type: 'video',
        thumbnail: '/assets/branding/image8.png',
        videoUrl: '/media/servicio-pasajero.mov',
        content: 'La excelencia en el trato a nuestros pasajeros: Servicio Puerta-a-Puerta.'
    },
    {
        id: 'importancia-llamadas',
        title: '¿Por qué es importante mantener contacto?',
        type: 'video',
        thumbnail: '/assets/branding/image30.png',
        videoUrl: '/media/importancia-llamadas.mov',
        content: 'La importancia de la comunicación y el protocolo de llamadas.'
    },
    {
        id: 'puntualidad-ausencias',
        title: 'Puntualidad y Ausencias',
        type: 'video',
        thumbnail: '/assets/branding/image32.png',
        videoUrl: '/media/protocolo-ausencias.mov',
        content: 'Protocolo formal ante ausencias, tardanzas y la importancia de la puntualidad.'
    },
    {
        id: 'registro-horario',
        title: 'Registro de Horario',
        type: 'video',
        thumbnail: '/assets/branding/image33.png',
        videoUrl: '/media/registro-horario.mov',
        content: 'Cómo registrar correctamente tu jornada laboral según lo asignado.'
    },
    {
        id: 'incidentes',
        title: 'Protocolo de Incidente',
        type: 'video',
        thumbnail: '/assets/branding/image34.png',
        videoUrl: '/media/protocolo-incidente.mov',
        content: 'Qué hacer y cómo reportar cuando ocurre un incidente en la ruta.'
    },
    {
        id: 'a-quien-llamar',
        title: '¿A quién debo llamar?',
        type: 'video',
        thumbnail: '/assets/branding/image18.png',
        videoUrl: '/media/comunicacion-supervisor.mov',
        content: 'Directorio de personal clave y departamentos a los que debes contactar según la situación.'
    },
    {
        id: 'accidentes',
        title: 'Protocolo de Accidente',
        type: 'video',
        thumbnail: '/assets/branding/image35.png',
        videoUrl: '/media/protocolo-accidente.mov',
        content: 'Seguridad primero: qué hacer específicamente en caso de un accidente de tránsito.'
    },
    {
        id: 'cierre-turno',
        title: 'Cierre de Turno',
        type: 'video',
        thumbnail: '/assets/branding/image36.png',
        videoUrl: '/media/cierre-turno.mov',
        content: 'Finalización correcta de tu jornada laboral.'
    },
    {
        id: 'guia-documentos',
        title: 'Guía de Documentos',
        type: 'document',
        thumbnail: '/assets/branding/image11.png',
        documents: [
            {
                name: 'Formulario I-9',
                description: 'Verificación de Elegibilidad de Empleo.',
                instructions: [
                    'Completar la Sección 1 a más tardar el primer día de empleo.',
                    'Asegurarse de firmar y fechar el documento.',
                    'Proveer documentos originales.'
                ]
            }
        ]
    },
    {
        id: 'politicas',
        title: 'Políticas Generales',
        type: 'policy',
        slides: [
            {
                title: 'Igualdad de Oportunidades en el Empleo',
                body: '<strong>TransCita valora la diversidad</strong> y está comprometida con la igualdad de oportunidades para todas las personas sin distinción de raza, religión, color, origen nacional, edad, sexo, orientación sexual, identidad de género, condición social, ideas políticas y religiosas, afiliación política, impedimento, ser víctima o percibida como víctima de violencia doméstica, agresión sexual o acecho, matrimonio, veterano, por tener peinados protectores y texturas de cabello que regularmente se asocian con identidades de raza y origen nacional particular información genética y cualquier otra razón contemplada en ley en materia de empleo, promociones, transferencias, despidos, terminaciones, compensación y beneficios, adiestramiento y reclutamiento. <strong>TransCita cumple con todas las leyes anti-discrimen</strong> en sus políticas, programas y actividades.'
            },
            {
                title: 'Ambiente de Trabajo Libre de Hostigamiento Sexual',
                body: 'Es política de TransCita tratar a cada empleado con <strong>respeto, cortesía y dignidad</strong>. Todo nuestro equipo en TransCita tiene el deber de mantener un lugar de empleo libre de cualquier tipo de acercamiento sexual no deseado, requerimiento de favores sexuales u otra conducta verbal, física, visual o electrónica de naturaleza sexual que constituya hostigamiento sexual. Cualquier empleado o funcionario que desee promover una investigación por hostigamiento sexual en el empleo deberá presentar su queja a <strong>Recursos Humanos a la mayor brevedad</strong>.'
            },
            {
                title: 'Protocolo contra el Discrimen por Orientación Sexual o Identidad de Género',
                body: 'TransCita no discrimina contra empleados o aspirantes a empleo por su orientación sexual o identidad de género, o cualquier otra razón contemplada en la Ley. <strong>Valoramos la diversidad</strong> y estamos comprometidos con la igualdad de oportunidades en todos los aspectos incluyendo, pero no limitando a empleo, promociones, transferencias, despidos, terminaciones, compensación y beneficios, adiestramiento y reclutamiento.'
            },
            {
                title: 'Ambiente de Trabajo Libre de Violencia y Violencia Doméstica',
                body: 'TransCita está comprometida a proveer un <strong>ambiente de trabajo libre de violencia</strong>, no permitirá comportamientos violentos. El supervisor o empleado que identifique una situación de violencia doméstica que pueda afectar el centro de trabajo hará un referido de la situación a <strong>Recursos Humanos</strong>.'
            },
            {
                title: 'Política de Denuncias (Whistleblowing)',
                body: 'TransCita promueve un ambiente de confianza y una cultura de puertas abiertas. Es deber de todos los miembros de TransCita el denunciar toda actividad o información que pueda considerarse:<br/><br/>• <strong>Ilegal o Inconstitucional</strong><br/>• <strong>Fraudulenta o Deshonesta</strong><br/>• <strong>Contrarias a las políticas</strong> o procedimientos corporativos.'
            },
            {
                title: 'Política y Protocolo para Prevenir el Acoso Laboral',
                body: 'En TransCita se prohíbe el acoso laboral. Cumplimos con la <strong>Ley 90-2020</strong>, Ley para prohibir y prevenir el Acoso Laboral en Puerto Rico. Reafirmamos que la <strong>dignidad del ser humano es inviolable</strong>. No se permite ninguna conducta abusiva verbal, escrita o física de forma reiterada que atente contra los derechos constitucionales protegidos.'
            },
            {
                title: 'Invitación para Veteranos y Personas con Impedimentos',
                body: 'TransCita toma <strong>acción afirmativa</strong> para el empleo de veteranos incapacitados que cualifiquen, veteranos de la era de Vietnam y personas con impedimentos. Si deseas que se te considere bajo este programa, favor de informarlo a la Oficina de Recursos Humanos. <strong>Es voluntario</strong>.'
            },
            {
                title: 'Asistencia y Puntualidad',
                body: 'La asistencia y puntualidad constituye un <strong>elemento clave y necesario</strong> para cumplir con nuestras metas. Se considera tardanza el comenzar labores <strong>cinco (5) minutos</strong> luego de la hora de entrada asignada. Si cumples con Asistencia y Puntualidad Perfecta <strong>ganas dinero adicional</strong>.'
            },
            {
                title: 'Horas de Trabajo y Registro de Asistencia',
                body: 'Debes registrar tu horario de trabajo exactamente según lo asignado. <strong>No debes marcar antes ni después</strong> del horario establecido. Es puntual. Sólo se pueden realizar cambios con la previa autorización de tu Coordinador de Rutas o Supervisor. Recuerda que la llamada se registra al igual que la autorización en el sistema.'
            },
            {
                title: 'Periodo de Tomar Alimentos',
                body: 'Tu tiempo de alimentos será según lo que indique tu horario. No puedes realizar cambios sin la previa autorización. Si tu horario no incluye un periodo asignado, este será luego de <strong>dos (2) horas</strong> de haber comenzado labores, siempre que no tengas un pasajero asignado al menos en la siguiente hora y treinta minutos.'
            },
            {
                title: 'Salud y Seguridad',
                body: 'El empleado debe asegurarse de realizar sus labores en un <strong>lugar adecuado y de manera segura</strong>. Es responsabilidad del empleado notificar a su supervisor inmediatamente que tenga un accidente ocupacional o una enfermedad ocupacional.'
            },
            {
                title: 'Periodo de Pago',
                body: '• Periodo del 1 al 15: se paga el día <strong>22 ó 23</strong>.<br/>• Periodo del 16 al fin de mes: se paga el día <strong>7 u 8</strong> del mes siguiente.'
            },
            {
                title: 'Ética y Conflicto de Intereses',
                body: 'Un conflicto de interés es cualquier actividad que pueda o aparente comprometer nuestro juicio. Esto incluye divulgar <strong>información confidencial</strong> o privilegiada. Es importante que el empleado <strong>no acepte ningún regalo o dinero</strong> que pueda traer la menor duda de un conflicto de interés.'
            },
            {
                title: 'Uniformes y Appearance Personal',
                body: 'Se espera que se presente con el <strong>uniforme completo y limpio</strong>: Camisa provista y pantalón largo negro. Debe evitar prendas llamativas, barbas deben estar arregladas, maquillaje y uñas sencillos. No se permitirán “body piercing” y/o tatuajes en lugares visibles. Debe utilizar fragancias con moderación.'
            },
            {
                title: 'Ambiente de Trabajo Libre de Drogas',
                body: 'Se prohíbe la elaboración, distribución, venta, posesión o uso de <strong>sustancias controladas</strong> en o fuera de los predios, en o fuera de horas de trabajo. Así mismo, se prohíbe estar bajo la influencia de drogas.'
            },
            {
                title: 'HIPAA (Privacidad de Salud)',
                body: 'TransCita tiene la responsabilidad legal y ética de proteger la <strong>privacidad de todos los pacientes</strong>. La información privada de salud debe mantenerse en <strong>estricta confidencialidad</strong>. El empleado no puede divulgar ninguna información a ninguna persona ni permitir examinar documentos.'
            }
        ]
    },
    {
        id: 'transciende',
        title: 'TransCiende',
        type: 'presentation',
        thumbnail: '/assets/branding/image36.png',
        slides: [
            {
                title: 'Programa TransCiende',
                body: 'Un programa integral de reconocimiento y compromiso diseñado para valorar la excelencia. Se enfoca en seis pilares: Servicio al Pasajero, Seguro al Volante y Milla Extra.'
            }
        ]
    },
    {
        id: 'fondos-unidos',
        title: 'Fondos Unidos',
        type: 'video',
        thumbnail: '/assets/branding/image5.png',
        videoUrl: '/media/Campaña-Fondos-Unidos-2024-X_YcZGjIxx0.mp4',
        content: 'TransCita apoya a Fondos Unidos de Puerto Rico.'
    },
    {
        id: 'equipo-proposito',
        title: 'Equipo con Propósito',
        type: 'presentation',
        slides: [
            {
                title: 'Unidos por un fin mayor',
                body: 'En TransCita no solo transportamos personas, cumplimos propósitos que salvan vidas. ¡Bienvenido a bordo!'
            }
        ]
    }
];

export const TRAINING_PROGRAMS: TrainingProgram[] = [
    {
        id: 'onboarding',
        title: 'Onboarding',
        description: 'Todo lo que necesitas saber en tu ingreso a TransCita.',
        emoji: '🚀',
        sections: ONBOARDING_SECTIONS
    },
    {
        id: 'servicio-cliente',
        title: 'Servicio al Cliente',
        description: 'Técnicas de comunicación y manejo de pasajeros.',
        emoji: '🤝',
        sections: [
            {
                id: 'comunicacion-efectiva',
                title: 'Comunicación Efectiva',
                type: 'presentation',
                slides: [{ title: 'El arte de escuchar', body: 'Escuchar es el 80% de una buena comunicación.' }]
            }
        ]
    },
    {
        id: 'seguridad-vial',
        title: 'Seguridad Vial',
        description: 'Protocolos de conducción defensiva y seguridad.',
        emoji: '🛡️',
        sections: [
            {
                id: 'conduccion-defensiva',
                title: 'Conducción Defensiva',
                type: 'presentation',
                slides: [{ title: 'Anticipación', body: 'Anticipar el peligro es la clave de la seguridad.' }]
            }
        ]
    },
    {
        id: 'patrono-training',
        title: 'Onboarding - Patrono',
        description: 'Gestión Corporativa y ROI del Bienestar.',
        emoji: '🏢',
        sections: [
            {
                id: 'vision-patrono',
                title: 'Visión y Metas a Corto Plazo',
                type: 'presentation',
                slides: [
                    { 
                        title: 'Visión del Proyecto HubTransCita', 
                        body: 'Nuestra visión es transformar el bienestar corporativo en Puerto Rico mediante una plataforma que sincroniza la movilidad, la salud y los beneficios económicos. Queremos que cada empleado sienta el respaldo de su empresa en cada paso.' 
                    },
                    { 
                        title: 'Metas a Corto Plazo', 
                        body: '• <strong>Automatización Total</strong>: Lograr que el 100% de los beneficios se rediman digitalmente sin fricciones.<br/>• <strong>Compliance del 100%</strong>: Asegurar que todo el personal complete sus adiestramientos regulatorios mediante nuestro LMS dinámico.<br/>• <strong>Impacto Medible</strong>: Proveer a los patronos con dashboards en tiempo real que demuestren el retorno de inversión en felicidad y retención de empleados.' 
                    }
                ]
            }
        ]
    },
    {
        id: 'negocio-training',
        title: 'Onboarding - Negocio',
        description: 'Maximiza el alcance de tu negocio en el Hub.',
        emoji: '📊',
        sections: [
            {
                id: 'vision-negocio',
                title: 'El Futuro de tu Negocio en el Hub',
                type: 'presentation',
                slides: [
                    { 
                        title: 'Crecimiento Colaborativo', 
                        body: 'Entendemos tu negocio como un pilar fundamental de la comunidad TransCita. Nuestra meta es conectarte directamente con miles de usuarios que buscan calidad y conveniencia.' 
                    },
                    { 
                        title: 'Estrategia a Corto Plazo', 
                        body: '• <strong>Visibilidad Segmentada</strong>: Posicionar tus ofertas frente a los usuarios con mayor probabilidad de redención.<br/>• <strong>Análisis Predictivo</strong>: Integrar datos de comportamiento para sugerirte qué ofertas lanzar y en qué horarios.<br/>• <strong>Lealtad Digital</strong>: Crear un ecosistema donde el usuario prefiera tu negocio por la facilidad de uso del Hub.' 
                    }
                ]
            }
        ]
    },
    {
        id: 'desarrollo-profesional',
        title: 'Desarrollo Profesional',
        description: 'Estrategias de retención de talento y beneficios de la plataforma.',
        emoji: '📈',
        sections: [
            {
                id: 'retencion-talento',
                title: 'El Valor de la Retención de Talento',
                type: 'presentation',
                slides: [
                    { title: '¿Por qué la retención es clave?', body: 'Retener a tus mejores empleados reduce significativamente los costos operativos, mantiene la continuidad del servicio y fomenta un ambiente de trabajo altamente productivo.' },
                    { title: 'El costo de la rotación', body: 'Reemplazar a un empleado puede representar un gasto mayor en esfuerzo de reclutamiento, pérdida de conocimiento interno y tiempo invertido en adiestramiento.' }
                ]
            },
            {
                id: 'beneficios-patrono',
                title: 'Beneficios para la Empresa (Patrono)',
                type: 'presentation',
                slides: [
                    { title: 'Gestión Simplificada y Eficiente', body: 'HubTransCita te provee herramientas automatizadas para administrar beneficios, adiestramientos y evaluar el desempeño de forma centralizada.' },
                    { title: 'Retorno de Inversión (ROI)', body: 'Invertir en el bienestar y desarrollo de tu equipo reduce el ausentismo, incrementa la lealtad y transforma tu ambiente laboral, generando mayor rentabilidad a largo plazo.' }
                ]
            },
            {
                id: 'beneficios-empleado',
                title: 'Beneficios y Bienestar para el Empleado',
                type: 'presentation',
                slides: [
                    { title: 'Reconocimiento y Recompensas', body: 'Tus empleados tienen acceso rápido a beneficios exclusivos y descuentos a través de nuestra red de negocios participantes al completar sus objetivos.' },
                    { title: 'Empoderamiento Digital', body: 'A través de su app móvil, el empleado gestiona su formación profesional en cualquier momento, sintiéndose parte de una comunidad que valora su crecimiento.' }
                ]
            },
            {
                id: 'funcionamiento-plataforma',
                title: '¿Cómo funciona la Plataforma?',
                type: 'presentation',
                slides: [
                    { title: 'Paso 1: Onboarding y Asignaciones', body: 'El Patrono da de alta a su personal y le asigna módulos de formación (como "Servicio al Cliente", "Seguridad Vial" o "Desarrollo Profesional").' },
                    { title: 'Paso 2: Participación del Equipo', body: 'El empleado toma los cursos dinámicos desde la comodidad de su celular y recibe notificaciones de progreso.' },
                    { title: 'Paso 3: Monitoreo y Éxito', body: 'El Patrono accede a su panel gerencial en tiempo real para visualizar quién completó los módulos y medir la mejora en el compromiso del equipo.' }
                ]
            }
        ]
    }
];
