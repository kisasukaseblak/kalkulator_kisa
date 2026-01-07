class ModernCalculator {
    constructor() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.currentOperandElement = document.getElementById('currentOperand');
        this.previousOperandElement = document.getElementById('previousOperand');
        this.historyList = document.getElementById('historyList');
        this.totalCalcsElement = document.getElementById('totalCalcs');
        this.todayCalcsElement = document.getElementById('todayCalcs');
        
        this.initializeEventListeners();
        this.loadHistory();
        this.loadTheme();
        this.updateStats();
        
        // Initialize display
        this.updateDisplay();
        
        // Add welcome effect
        this.showWelcomeEffect();
    }

    showWelcomeEffect() {
        // Animate the display on startup
        setTimeout(() => {
            this.currentOperandElement.style.transform = 'scale(1.1)';
            this.currentOperandElement.style.color = 'var(--primary-neon)';
            
            setTimeout(() => {
                this.currentOperandElement.style.transform = 'scale(1)';
                this.currentOperandElement.style.color = 'var(--text-primary)';
            }, 500);
        }, 1000);
    }

    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
                this.updateDisplay();
                this.addButtonPressEffect(button);
            });
        });

        // Operator buttons
        document.querySelectorAll('[data-operator]').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.dataset.operator);
                this.updateDisplay();
                this.addButtonPressEffect(button);
            });
        });

        // Function buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                this.handleAction(button.dataset.action);
                this.updateDisplay();
                this.addButtonPressEffect(button);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Clear history
        document.getElementById('clearHistory').addEventListener('click', () => {
            this.clearHistory();
        });

        // Export history
        document.getElementById('exportHistory').addEventListener('click', () => {
            this.exportHistory();
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Add sound effects toggle
        this.soundEnabled = true;
    }

    addButtonPressEffect(button) {
        // Add visual feedback
        button.style.transform = 'translateY(-1px) scale(0.98)';
        button.querySelector('.btn-bg').style.opacity = '0.4';
        
        // Play sound effect
        if (this.soundEnabled) {
            this.playSound(button.classList.contains('operator-btn') ? 'operator' : 'button');
        }
        
        setTimeout(() => {
            button.style.transform = '';
            button.querySelector('.btn-bg').style.opacity = '';
        }, 150);
    }

    playSound(type) {
        // Create audio context for sound effects
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Different frequencies for different button types
        const frequencies = {
            'button': 800,
            'operator': 600,
            'equals': 1000
        };
        
        oscillator.frequency.setValueAtTime(frequencies[type] || 800, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        this.currentOperand = this.currentOperand.toString() + number.toString();
        
        // Add typing effect
        this.addTypingEffect();
    }

    addTypingEffect() {
        const cursor = document.querySelector('.cursor-blink');
        if (cursor) {
            cursor.style.animation = 'none';
            setTimeout(() => {
                cursor.style.animation = 'blink 1s infinite';
            }, 100);
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        
        // Add operation selection effect
        this.addOperationEffect();
    }

    addOperationEffect() {
        const display = document.querySelector('.display-frame');
        display.style.borderColor = 'var(--secondary-neon)';
        setTimeout(() => {
            display.style.borderColor = 'var(--glass-border)';
        }, 300);
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = current * prev;
                break;
            case '/':
                if (current === 0) {
                    this.showError('Division by zero is undefined');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Save to database
        const expression = `${this.previousOperand} ${this.getOperatorSymbol(this.operation)} ${this.currentOperand}`;
        this.saveCalculation(expression, computation);
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        
        // Add result effect
        this.addResultEffect();
    }

    addResultEffect() {
        const currentDisplay = this.currentOperandElement;
        currentDisplay.style.color = 'var(--accent-neon)';
        currentDisplay.style.textShadow = 'var(--neon-glow)';
        currentDisplay.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            currentDisplay.style.color = 'var(--text-primary)';
            currentDisplay.style.textShadow = 'var(--soft-glow)';
            currentDisplay.style.transform = 'scale(1)';
        }, 1000);
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                this.addClearEffect();
                break;
            case 'delete':
                this.delete();
                break;
            case 'equals':
                this.compute();
                if (this.soundEnabled) this.playSound('equals');
                break;
            case 'decimal':
                this.appendNumber('.');
                break;
            case 'percent':
                this.percentage();
                break;
            case 'sqrt':
                this.squareRoot();
                break;
            case 'sin':
                this.trigonometric('sin');
                break;
            case 'cos':
                this.trigonometric('cos');
                break;
            case 'tan':
                this.trigonometric('tan');
                break;
            case 'log':
                this.logarithm('log');
                break;
            case 'ln':
                this.logarithm('ln');
                break;
            case 'power':
                this.power();
                break;
        }
    }

    addClearEffect() {
        const display = document.querySelector('.display-frame');
        display.style.background = 'rgba(255, 0, 64, 0.1)';
        setTimeout(() => {
            display.style.background = 'rgba(0, 0, 0, 0.4)';
        }, 200);
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        const result = current / 100;
        const expression = `${current}%`;
        this.saveCalculation(expression, result);
        
        this.currentOperand = result;
        this.shouldResetScreen = true;
    }

    squareRoot() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        if (current < 0) {
            this.showError('Cannot calculate square root of negative number');
            return;
        }
        
        const result = Math.sqrt(current);
        const expression = `√${current}`;
        this.saveCalculation(expression, result);
        
        this.currentOperand = result;
        this.shouldResetScreen = true;
    }

    trigonometric(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        const radians = current * (Math.PI / 180); // Convert to radians
        
        switch (func) {
            case 'sin':
                result = Math.sin(radians);
                break;
            case 'cos':
                result = Math.cos(radians);
                break;
            case 'tan':
                result = Math.tan(radians);
                break;
        }
        
        const expression = `${func}(${current}°)`;
        this.saveCalculation(expression, result);
        
        this.currentOperand = result;
        this.shouldResetScreen = true;
    }

    logarithm(type) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        if (current <= 0) {
            this.showError('Logarithm can only be calculated for positive numbers');
            return;
        }
        
        let result;
        let expression;
        
        if (type === 'log') {
            result = Math.log10(current);
            expression = `log(${current})`;
        } else {
            result = Math.log(current);
            expression = `ln(${current})`;
        }
        
        this.saveCalculation(expression, result);
        
        this.currentOperand = result;
        this.shouldResetScreen = true;
    }

    power() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        const result = Math.pow(current, 2);
        const expression = `${current}²`;
        this.saveCalculation(expression, result);
        
        this.currentOperand = result;
        this.shouldResetScreen = true;
    }

    getOperatorSymbol(operation) {
        switch (operation) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return operation;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.formatNumber(this.currentOperand) || '0';
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.formatNumber(this.previousOperand)} ${this.getOperatorSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    formatNumber(number) {
        if (number === '') return '';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en-US', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    showError(message) {
        this.currentOperandElement.textContent = 'ERROR';
        this.currentOperandElement.classList.add('error');
        
        // Add error effect
        const display = document.querySelector('.display-frame');
        display.style.borderColor = 'var(--danger-neon)';
        display.style.boxShadow = '0 0 20px var(--danger-neon)';
        
        setTimeout(() => {
            this.clear();
            this.updateDisplay();
            this.currentOperandElement.classList.remove('error');
            display.style.borderColor = 'var(--glass-border)';
            display.style.boxShadow = '';
        }, 2000);
        
        // Show error notification
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'var(--danger-neon)' : 'var(--primary-neon)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: var(--glass-shadow);
            z-index: 1000;
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async saveCalculation(expression, result) {
        try {
            await calculatorDB.saveCalculation(expression, result);
            this.addHistoryItem(expression, result, new Date());
            this.updateStats();
        } catch (error) {
            console.error('Error saving calculation:', error);
        }
    }

    async loadHistory() {
        try {
            const history = await calculatorDB.getCalculationHistory(20);
            this.historyList.innerHTML = '';
            
            history.forEach(item => {
                this.addHistoryItem(item.expression, item.result, new Date(item.timestamp));
            });
        } catch (error) {
            console.error('Error loading history:', error);
        }
    }

    addHistoryItem(expression, result, timestamp) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <div class="history-expression">${expression}</div>
            <div class="history-result">= ${this.formatNumber(result)}</div>
            <div class="history-time">${timestamp.toLocaleString('en-US')}</div>
        `;
        
        historyItem.addEventListener('click', () => {
            this.currentOperand = result.toString();
            this.updateDisplay();
            this.addResultEffect();
        });
        
        this.historyList.insertBefore(historyItem, this.historyList.firstChild);
    }

    async clearHistory() {
        try {
            await calculatorDB.clearHistory();
            this.historyList.innerHTML = '';
            this.updateStats();
            this.showNotification('Memory cleared successfully');
        } catch (error) {
            console.error('Error clearing history:', error);
            this.showNotification('Failed to clear memory', 'error');
        }
    }

    async exportHistory() {
        try {
            const history = await calculatorDB.getCalculationHistory(1000);
            const data = {
                exportDate: new Date().toISOString(),
                calculations: history
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `calculator-history-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('History exported successfully');
        } catch (error) {
            console.error('Error exporting history:', error);
            this.showNotification('Failed to export history', 'error');
        }
    }

    async updateStats() {
        try {
            const stats = await calculatorDB.getStatistics();
            this.totalCalcsElement.textContent = stats.totalCalculations;
            this.todayCalcsElement.textContent = stats.todayCalculations;
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Save theme preference
        calculatorDB.saveSetting('theme', newTheme);
        
        // Add theme transition effect
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    async loadTheme() {
        try {
            const savedTheme = await calculatorDB.getSetting('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
                const themeIcon = document.querySelector('#themeToggle i');
                themeIcon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    }

    showSettings() {
        // Create settings modal
        const modal = document.createElement('div');
        modal.className = 'settings-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-cog"></i> QUANTUM SETTINGS</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" ${this.soundEnabled ? 'checked' : ''} id="soundToggle">
                            <span>Sound Effects</span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <span>Display Precision</span>
                            <select id="precisionSelect">
                                <option value="2">2 decimals</option>
                                <option value="4">4 decimals</option>
                                <option value="6" selected>6 decimals</option>
                                <option value="8">8 decimals</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#soundToggle').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            calculatorDB.saveSetting('soundEnabled', this.soundEnabled);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
            this.updateDisplay();
        }
        
        if (e.key === '.') {
            this.appendNumber('.');
            this.updateDisplay();
        }
        
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            this.chooseOperation(e.key);
            this.updateDisplay();
        }
        
        if (e.key === 'Enter' || e.key === '=') {
            this.compute();
            this.updateDisplay();
        }
        
        if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
            this.clear();
            this.updateDisplay();
        }
        
        if (e.key === 'Backspace') {
            this.delete();
            this.updateDisplay();
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new ModernCalculator();
    
    // Add CSS for notifications and modals
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .modal-content {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 30px;
            min-width: 400px;
            color: var(--text-primary);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--glass-border);
        }
        
        .modal-header h3 {
            font-family: 'Orbitron', monospace;
            color: var(--primary-neon);
        }
        
        .close-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 24px;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .close-btn:hover {
            color: var(--danger-neon);
        }
        
        .setting-item {
            margin-bottom: 20px;
        }
        
        .setting-item label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Rajdhani', sans-serif;
            font-size: 16px;
        }
        
        .setting-item input, .setting-item select {
            background: var(--button-gradient);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 8px 12px;
            color: var(--text-primary);
        }
    `;
    document.head.appendChild(style);
});