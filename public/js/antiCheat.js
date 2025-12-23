// public/js/antiCheat.js
class AntiCheat {
    constructor(maxWarnings = 3) {
        this.warnings = 0;
        this.maxWarnings = maxWarnings;
        this.isActive = false;
        this.init();
    }

    init() {
        window.addEventListener('blur', () => this.handleViolation());
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.handleViolation();
        });
    }

    start() {
        this.isActive = true;
    }

    stop() {
        this.isActive = false;
    }

    handleViolation() {
        if (!this.isActive) return;

        this.warnings++;
        this.updateUI();

        if (this.warnings >= this.maxWarnings) {
            this.terminateSession();
        } else {
            alert(`Anti-Cheat Warning ${this.warnings}/3: Tab switching detected!`);
            this.logViolation('Tab/Window switch');
        }
    }

    updateUI() {
        const countDisplay = document.getElementById('warning-count');
        if (countDisplay) countDisplay.innerText = `${this.warnings}/${this.maxWarnings}`;
    }

    async logViolation(type) {
        try {
            await fetch('/api/anticheat/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
        } catch (e) { console.error("Logging failed", e); }
    }

    terminateSession() {
        alert('Maximum warnings reached. You have been logged out.');
        window.location.href = '/';
    }
}

export const antiCheat = new AntiCheat();