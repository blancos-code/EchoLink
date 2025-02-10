export function getPriorityRadius(priority) {
    switch (priority) {
        case 1: // Critique
            return 16;
        case 2: // Urgent
            return 10;
        case 3: // Normal
            return 6;
        default:
            return 6;
    }
}

export function getMarkerColor(incidentType) {
    switch (incidentType) {
        case 'Urgence médicale':
            return '#ffa600';
        case 'Problème de sécurité':
            return '#000000';
        case 'Besoin d\'assistance':
            return '#00a7e3';
        default:
            return '#00bbff';
    }
}

export const incidentTypes = [
    'Urgence médicale',
    'Problème de sécurité',
    'Besoin d\'assistance'
];

export const priorityLevels = {
    1: 'Critique',
    2: 'Urgent',
    3: 'Normal'
};

export const incidentDescriptions = {
    'Urgence médicale': [
        {desc: 'Malaise dans la rue', priority: 2},
        {desc: 'Chute avec blessure grave', priority: 1},
        {desc: 'Besoin d\'assistance médicale urgente', priority: 2},
        {desc: 'Personne inconsciente', priority: 1}
    ],
    'Problème de sécurité': [
        {desc: 'Comportement suspect', priority: 3},
        {desc: 'Situation dangereuse', priority: 2},
        {desc: 'Besoin d\'intervention immédiate', priority: 1},
        {desc: 'Accident de la route', priority: 1}
    ],
    'Besoin d\'assistance': [
        {desc: 'Personne âgée en difficulté', priority: 2},
        {desc: 'Personne perdue', priority: 3},
        {desc: 'Besoin d\'aide immédiate', priority: 2},
        {desc: 'Situation de détresse', priority: 1}
    ]
};

export const frenchCities = [
    {name: 'Paris', lat: 48.8566, lng: 2.3522},
    {name: 'Lyon', lat: 45.7578, lng: 4.8320},
    {name: 'Marseille', lat: 43.2965, lng: 5.3698},
    {name: 'Toulouse', lat: 43.6047, lng: 1.4442},
    {name: 'Bordeaux', lat: 44.8378, lng: -0.5792},
    {name: 'Lille', lat: 50.6292, lng: 3.0573},
    {name: 'Nantes', lat: 47.2184, lng: -1.5536}
];