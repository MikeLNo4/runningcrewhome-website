/**
 * RunningCrewHome - Invite Page JavaScript
 *
 * Loads invitation data from Firestore and displays it on the page.
 * Uses client-side rendering with Firebase Web SDK.
 */

// Configuration
const CONFIG = {
    // Base URL for the website
    baseUrl: 'https://www.runningcrewhome.com',
    // App Store URL
    appStoreUrl: 'https://apps.apple.com/de/app/runningcrewhome/id6756790104',
    // Default crew logo
    defaultLogoUrl: 'logo.png'
};

// DOM Elements
let elements = {};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    elements = {
        loadingState: document.getElementById('loading-state'),
        errorState: document.getElementById('error-state'),
        inviteContent: document.getElementById('invite-content'),
        errorMessage: document.getElementById('error-message'),

        // Invite content elements
        crewLogo: document.getElementById('crew-logo'),
        crewName: document.getElementById('crew-name'),
        inviteTitle: document.getElementById('invite-title'),
        inviteDescription: document.getElementById('invite-description'),
        inviteDatetime: document.getElementById('invite-datetime'),
        inviteMeetingPoint: document.getElementById('invite-meeting-point'),
        meetingPointRow: document.getElementById('meeting-point-row'),
        inviteDistance: document.getElementById('invite-distance'),
        distanceRow: document.getElementById('distance-row'),
        invitePace: document.getElementById('invite-pace'),
        paceRow: document.getElementById('pace-row'),
        inviteRoute: document.getElementById('invite-route'),
        routeRow: document.getElementById('route-row'),
        inviteStatus: document.getElementById('invite-status'),
        statusText: document.getElementById('status-text'),
        creatorName: document.getElementById('creator-name')
    };

    // Wait for Firebase to be ready
    if (window.firebaseDb) {
        loadInvitation();
    } else {
        window.addEventListener('firebase-ready', loadInvitation);
    }
});

/**
 * Parse URL parameters to get invitation and crew IDs
 */
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        inviteId: urlParams.get('id'),
        crewId: urlParams.get('crew')
    };
}

/**
 * Main function to load invitation data from Firestore
 */
async function loadInvitation() {
    const { inviteId, crewId } = getUrlParams();

    console.log('📋 Loading invitation:', inviteId, 'from crew:', crewId);

    // Validate parameters
    if (!inviteId || !crewId) {
        showError('Ungültiger Einladungslink. Die Einladungs-ID oder Crew-ID fehlt.');
        return;
    }

    try {
        const db = window.firebaseDb;
        const doc = window.firebaseDoc;
        const getDoc = window.firebaseGetDoc;

        // Load invitation document
        const inviteRef = doc(db, 'crews', crewId, 'runInvitations', inviteId);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists()) {
            showError('Diese Einladung existiert nicht oder wurde gelöscht.');
            return;
        }

        const inviteData = inviteSnap.data();
        console.log('✅ Invitation loaded:', inviteData);

        // Load crew document for logo and name
        const crewRef = doc(db, 'crews', crewId);
        const crewSnap = await getDoc(crewRef);

        let crewData = { name: 'Running Crew' };
        if (crewSnap.exists()) {
            crewData = crewSnap.data();
            console.log('✅ Crew loaded:', crewData.name);
        }

        // Display the invitation
        displayInvitation(inviteData, crewData);

        // Update page meta tags for social sharing
        updateMetaTags(inviteData, crewData);

        // Track view event (if analytics is set up)
        trackInviteView(inviteId, crewId);

    } catch (error) {
        console.error('❌ Error loading invitation:', error);
        showError('Fehler beim Laden der Einladung. Bitte versuche es später erneut.');
    }
}

/**
 * Display invitation data on the page
 */
function displayInvitation(invite, crew) {
    // Hide loading, show content
    elements.loadingState.style.display = 'none';
    elements.inviteContent.style.display = 'block';

    // Crew info
    if (crew.thumbnailURL) {
        elements.crewLogo.src = crew.thumbnailURL;
    } else if (crew.profilePictureURL) {
        elements.crewLogo.src = crew.profilePictureURL;
    }
    elements.crewLogo.alt = crew.name || 'Crew Logo';
    elements.crewName.textContent = crew.name || 'Running Crew';

    // Title
    elements.inviteTitle.textContent = invite.title || 'Run with me';

    // Description (optional)
    if (invite.description) {
        elements.inviteDescription.textContent = invite.description;
        elements.inviteDescription.style.display = 'block';
    }

    // Date & Time
    if (invite.startTime) {
        const startDate = invite.startTime.toDate ? invite.startTime.toDate() : new Date(invite.startTime);
        elements.inviteDatetime.textContent = formatDateTime(startDate);
    }

    // Meeting Point (optional)
    if (invite.meetingPoint && invite.meetingPoint.name) {
        elements.inviteMeetingPoint.textContent = invite.meetingPoint.name;
        if (invite.meetingPoint.formattedAddress) {
            elements.inviteMeetingPoint.innerHTML = `
                ${invite.meetingPoint.name}
                <span class="detail-subtext">${invite.meetingPoint.formattedAddress}</span>
            `;
        }
        elements.meetingPointRow.style.display = 'flex';
    }

    // Distance (optional)
    if (invite.minDistance || invite.maxDistance) {
        elements.inviteDistance.textContent = formatDistanceRange(invite.minDistance, invite.maxDistance);
        elements.distanceRow.style.display = 'flex';
    }

    // Pace (optional)
    if (invite.minPace || invite.maxPace) {
        elements.invitePace.textContent = formatPaceRange(invite.minPace, invite.maxPace);
        elements.paceRow.style.display = 'flex';
    }

    // Route (optional)
    if (invite.routeName) {
        elements.inviteRoute.textContent = invite.routeName;
        elements.routeRow.style.display = 'flex';
    }

    // Creator name
    if (invite.creatorName) {
        elements.creatorName.textContent = invite.creatorName;
    }

    // Check status (expired, cancelled)
    checkInviteStatus(invite);
}

/**
 * Check and display invite status (expired, cancelled)
 */
function checkInviteStatus(invite) {
    const now = new Date();
    let startTime = null;

    if (invite.startTime) {
        startTime = invite.startTime.toDate ? invite.startTime.toDate() : new Date(invite.startTime);
    }

    // Check if cancelled
    if (invite.status === 'cancelled') {
        elements.inviteStatus.style.display = 'block';
        elements.inviteStatus.className = 'invite-status status-cancelled';
        elements.statusText.textContent = 'Abgesagt';
        return;
    }

    // Check if expired (start time has passed)
    if (startTime && startTime < now) {
        elements.inviteStatus.style.display = 'block';
        elements.inviteStatus.className = 'invite-status status-expired';
        elements.statusText.textContent = 'Bereits stattgefunden';
    }
}

/**
 * Update meta tags for social sharing (Open Graph, Twitter Cards)
 */
function updateMetaTags(invite, crew) {
    const title = `${invite.title || 'Run with me'} - ${crew.name || 'RunningCrewHome'}`;

    let description = `${crew.name || 'Eine Running Crew'} lädt dich zu einem Run ein!`;
    if (invite.startTime) {
        const startDate = invite.startTime.toDate ? invite.startTime.toDate() : new Date(invite.startTime);
        description += ` Am ${formatDate(startDate)} um ${formatTime(startDate)}.`;
    }

    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('description', description);

    // Update image if crew has a logo
    if (crew.thumbnailURL || crew.profilePictureURL) {
        const imageUrl = crew.thumbnailURL || crew.profilePictureURL;
        updateMetaTag('og:image', imageUrl);
        updateMetaTag('twitter:image', imageUrl);
    }
}

/**
 * Helper to update a meta tag
 */
function updateMetaTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`) ||
               document.querySelector(`meta[name="${property}"]`);
    if (meta) {
        meta.setAttribute('content', content);
    }
}

/**
 * Show error state
 */
function showError(message) {
    elements.loadingState.style.display = 'none';
    elements.errorState.style.display = 'block';
    elements.errorMessage.textContent = message;
}

/**
 * Track invite view for analytics
 */
function trackInviteView(inviteId, crewId) {
    // Google Analytics event (if gtag is available)
    if (typeof gtag === 'function') {
        gtag('event', 'invite_viewed', {
            'invite_id': inviteId,
            'crew_id': crewId,
            'source': getRefererSource()
        });
    }

    console.log('📊 Invite view tracked:', inviteId);
}

/**
 * Determine referrer source for analytics
 */
function getRefererSource() {
    const referer = document.referrer.toLowerCase();
    if (referer.includes('instagram')) return 'instagram';
    if (referer.includes('whatsapp')) return 'whatsapp';
    if (referer.includes('telegram')) return 'telegram';
    if (referer.includes('facebook')) return 'facebook';
    if (referer.includes('twitter') || referer.includes('x.com')) return 'twitter';
    if (referer.includes('linkedin')) return 'linkedin';
    return 'direct';
}

// ==========================================
// FORMATTING HELPERS
// ==========================================

/**
 * Format date and time in German format
 */
function formatDateTime(date) {
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('de-DE', options) + ' Uhr';
}

/**
 * Format date only
 */
function formatDate(date) {
    const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    };
    return date.toLocaleDateString('de-DE', options);
}

/**
 * Format time only
 */
function formatTime(date) {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format distance range (meters to km)
 */
function formatDistanceRange(minMeters, maxMeters) {
    const min = minMeters ? (minMeters / 1000).toFixed(1) : null;
    const max = maxMeters ? (maxMeters / 1000).toFixed(1) : null;

    if (min && max) {
        if (min === max) {
            return `${min} km`;
        }
        return `${min} - ${max} km`;
    }
    if (min) return `ab ${min} km`;
    if (max) return `bis ${max} km`;
    return '-';
}

/**
 * Format pace range (seconds per km to min:sec/km)
 */
function formatPaceRange(minPaceSeconds, maxPaceSeconds) {
    const formatPace = (seconds) => {
        if (!seconds) return null;
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const min = formatPace(minPaceSeconds);
    const max = formatPace(maxPaceSeconds);

    if (min && max) {
        if (min === max) {
            return `${min} min/km`;
        }
        return `${min} - ${max} min/km`;
    }
    if (min) return `${min} min/km`;
    if (max) return `${max} min/km`;
    return '-';
}
