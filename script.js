        ////////// CONFIGURATION DE API
        const CONFIG = {
            WEATHER_API_KEY: '2c3c83b617e1a6a1ce320ddf94db8e35',
            CITY: 'Paris'
        };

        ////////// CONFIGURATION GOOGLE CALENDAR
        const GOOGLE_CONFIG = {
            API_KEY: 'AIzaSyCvdrPZHJ4YT7qfi-LpHUg1O3BK-wP8t9I', 
            CALENDAR_ID: 'hcarrance@gmail.com' 
        };

        ////////// FONCTIONS QUI GERE LA SYNCHRO JOUR NUIT

        async function UpdateSunMoon() {
            const body_degrade = document.querySelector('body')
            const div_degrade = document.getElementById('icon-journee')
            const iconDate = document.getElementById('sun-moon-icon')
            const infoJour = document.getElementById('info-text-1')
            const infoDate = document.getElementById('info-text-2')
            const infoHeure = document.getElementById('info-text-3')
            
            // Éléments zone 3 météo
            const iconeMeteo = document.getElementById('icone-meteo')
            const tempMeteo = document.getElementById('temp-meteo')

            if (CONFIG.WEATHER_API_KEY === '') {
                iconDate.textContent = '⚙️'
                infoElement.textContent = 'Configuration de l\'API nécessaire'
                return
            }

            //////////CONFIGURATION DE LA DATE
            let nowDate = new Date()

            // Jour en FR et date
            const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
            const jour = joursSemaine[nowDate.getDay()]
            const date = `${String(nowDate.getDate()).padStart(2, '0')}/${String(nowDate.getMonth() + 1).padStart(2, '0')}/${nowDate.getFullYear()}`
            // Heure
            const heure = `${String(nowDate.getHours()).padStart(2, '0')}:${String(nowDate.getMinutes()).padStart(2, '0')}`

            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${CONFIG.CITY}&appid=${CONFIG.WEATHER_API_KEY}&units=metric&lang=fr`
                const response = await fetch(url)
                
                if (!response.ok) {
                    throw new Error('Erreur API');
                }
                
                const data = await response.json()
                
                // ===== ZONE 3 : MÉTÉO =====
                // Récupérer température et icône météo
                const temperature = Math.round(data.main.temp)
                const weatherIcon = data.weather[0].icon
                const weatherDescription = data.weather[0].description
                
                // Utiliser les icônes d'OpenWeather (PNG haute qualité)
                iconeMeteo.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
                iconeMeteo.alt = weatherDescription
                tempMeteo.textContent = `${temperature}°C - ${weatherDescription}`
                
                // Timestamps de lever et coucher du soleil (en secondes)
                const sunrise = data.sys.sunrise
                const sunset = data.sys.sunset
                const now = Math.floor(Date.now() / 1000)
                
                // Convertir en heures locales pour affichage
                const sunriseDate = new Date(sunrise * 1000)
                const sunsetDate = new Date(sunset * 1000)
                const sunriseTime = `${String(sunriseDate.getHours()).padStart(2, '0')}:${String(sunriseDate.getMinutes()).padStart(2, '0')}`
                const sunsetTime = `${String(sunsetDate.getHours()).padStart(2, '0')}:${String(sunsetDate.getMinutes()).padStart(2, '0')}`
                
                // Calculer 1 heure après le lever et 1 heure avant le coucher
                const morningEnd = sunrise + 3600; // +1 heure
                const eveningStart = sunset - 3600; // -1 heure
                
                // Déterminer l'icône à afficher
                if (now < sunrise) {
                    // Nuit (avant le lever du soleil)
                    iconDate.src = 'images/lune.png'
                    iconDate.className = 'param_img_lune'
                    body_degrade.className = 'body_night'
                    div_degrade.className = 'param_night'
                    infoJour.textContent = `${jour}`
                    infoDate.textContent = `${date}`
                    infoHeure.textContent = `${heure}`
                } else if (now >= sunrise && now < morningEnd) {
                    // Matinée (lever du soleil jusqu'à 1h après)
                    iconDate.src = 'images/coucher.png'
                    iconDate.className = 'param_img_coucher'
                    body_degrade.className = 'body_coucher'
                    div_degrade.className = 'param_coucher'
                    infoJour.textContent = `${jour}`
                    infoDate.textContent = `${date}`
                    infoHeure.textContent = `${heure}`
                } else if (now >= morningEnd && now < eveningStart) {
                    // Journée
                    iconDate.src = 'images/soleil.png'
                    iconDate.className = 'param_img_soleil'
                    body_degrade.className = 'body_day'
                    div_degrade.className = 'param_day'
                    infoJour.textContent = `${jour}`
                    infoDate.textContent = `${date}`
                    infoHeure.textContent = `${heure}`
                } else if (now >= eveningStart && now < sunset) {
                    // Soir (1h avant le coucher jusqu'au coucher)
                    iconDate.src = 'images/coucher.png'
                    iconDate.className = 'param_img_coucher'
                    body_degrade.className = 'body_coucher'
                    div_degrade.className = 'param_coucher'
                    infoJour.textContent = `${jour}`
                    infoDate.textContent = `${date}`
                    infoHeure.textContent = `${heure}`
                } else {
                    // Nuit (après le coucher du soleil)
                    iconDate.src = 'images/lune.png'
                    iconDate.className = 'param_img_lune'
                    body_degrade.className = 'body_night'
                    div_degrade.className = 'param_night'
                    infoJour.textContent = `${jour}`
                    infoDate.textContent = `${date}`
                    infoHeure.textContent = `${heure}`
                }
                
            } catch (error) {
                iconDate.textContent = 'erreur'
                infoJour.textContent = `${jour}`
                infoHeure.textContent = `${heure}`
                tempMeteo.textContent = 'Erreur météo'
                console.error('Erreur:', error)
            }
        }

        ///////// FONCTION QUI RECOIT LES INFOS DU SERVEUR FLASK ET GENERE LE HTML EN CONSEQUENCE
        async function updateSystemInfo() {
            const tempDisplay = document.getElementById('temp-display')
            const uptimeDisplay = document.getElementById('uptime-display') 
            const infoBox1 = document.querySelector('.info-box-1');
            
            try {
                const response = await fetch('http://localhost:5000/system-info');
                const systemInfo = await response.json();

                let FormatageTemp ;
                
                // Formatage de la température
                if (systemInfo.temperature !== 'N/A') {
                    FormatageTemp = `${systemInfo.temperature}°C`
                } 
                if (systemInfo.temperature === 'N/A') {
                    FormatageTemp = 'N/A'
                }
                
                //Affichage du HTML
                tempDisplay.textContent = `Temp CPU: ${FormatageTemp}`;
                uptimeDisplay.textContent = `En marche depuis :\n${systemInfo.uptime_jours}j - ${systemInfo.uptime_heures}h ${systemInfo.uptime_minutes}`
                
            } catch (error) {
                console.error('Erreur lors de la récupération des systemInfo :', error);
                tempDisplay.textContent = `erreur`
                uptimeDisplay.textContent = `erreur`                
            }
        }


        ///////// FONCTION QUI S'OCCUPE DE LA ZONE 2 : L'API GOOGLE AGENDA
        async function updateNextEvent() {
            const zone2 = document.querySelector('.zone_2');
            const zone_2_titre = document.getElementById('zone_2_titre');
            const zone_2_event = document.getElementById('zone_2_event');
            const zone_2_description = document.getElementById('zone_2_description');
            
            try {
                // Date actuelle
                const now = new Date().toISOString();
                
                // URL de l'API Google Calendar
                const url = `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CONFIG.CALENDAR_ID}/events?key=${GOOGLE_CONFIG.API_KEY}&timeMin=${now}&maxResults=1&orderBy=startTime&singleEvents=true`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`Erreur API: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Vérifier s'il y a des événements
                if (data.items && data.items.length > 0) {
                    const event = data.items[0];
                    
                    // Extraire les infos
                    const titre = event.summary || 'Sans titre';
                    const start = event.start.dateTime || event.start.date;
                    const startDate = new Date(start);
                    
                    // Formater la date et l'heure
                    const joursSemaine = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
                    const jour = joursSemaine[startDate.getDay()];
                    const date = `${String(startDate.getDate()).padStart(2, '0')}/${String(startDate.getMonth() + 1).padStart(2, '0')}`;
                    const heure = event.start.dateTime 
                        ? `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`
                        : 'Toute la journée';
                    
                    // Afficher dans la zone 2

                    zone_2_titre.textContent = 'Prochain événement' ;
                    zone_2_event.textContent = titre ;
                    zone_2_description.textContent = `${jour} ${date} - ${heure}`;

                } else {
                    // Aucun événement à venir
                    zone_2_titre.textContent = 'Calendrier vide' ;
                    zone_2_event.textContent = 'Aucun événement à venir' ;
                }
                
            } catch (error) {
                console.error('Erreur Google Calendar:', error);
                zone_2_titre.textContent = 'Erreur Calendar' ;
                zone_2_event.textContent = 'Vérifiez la clé API' ;

            }
        }

        ///////// FONCTION QUI AFFICHE LES OBJECTIFS DANS LE BANDEAU
        async function updateObjectifs() {
            const bandeauDroite = document.querySelector('.bandeau_droite');
            
            try {
                const response = await fetch('http://localhost:5000/objectifs');
                const data = await response.json();
                
                if (data.objectifs && data.objectifs.length > 0) {
                    // Créer le HTML avec la liste des objectifs
                    let objectifsHTML = '<div class="objectifs-container">';
                    objectifsHTML += '<h2 class="objectifs-titre">Mes Objectifs</h2>';
                    objectifsHTML += '<ul class="objectifs-liste">';
                    
                    data.objectifs.forEach(objectif => {
                        objectifsHTML += `<li class="objectif-item">${objectif}</li>`;
                    });
                    
                    objectifsHTML += '</ul></div>';
                    
                    bandeauDroite.innerHTML = objectifsHTML;
                } else {
                    bandeauDroite.innerHTML = `
                        <div class="objectifs-container">
                            <h2 class="objectifs-titre">Mes Objectifs</h2>
                            <p style="color: white; padding: 20px; text-align: center;">Aucun objectif défini</p>
                        </div>
                    `;
                }
                
            } catch (error) {
                console.error('Erreur lors de la récupération des objectifs:', error);
                bandeauDroite.innerHTML = `
                    <div class="objectifs-container">
                        <h2 class="objectifs-titre">Mes Objectifs</h2>
                        <p style="color: red; padding: 20px; text-align: center;">Erreur de chargement</p>
                    </div>
                `;
            }
        }


        // Charger au démarrage
        UpdateSunMoon()
        updateSystemInfo()
        updateNextEvent()
        updateObjectifs()

        // Actualiser toutes les minutes
        setInterval(UpdateSunMoon, 60000)
        setInterval(updateSystemInfo, 5000)
        setInterval(updateNextEvent, 60000)
        setInterval(updateObjectifs, 60000)