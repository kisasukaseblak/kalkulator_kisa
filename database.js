// Database management using IndexedDB for storing calculation history
class CalculatorDatabase {
    constructor() {
        this.dbName = 'CalculatorDB';
        this.version = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Database error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database initialized successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object store for calculation history
                if (!db.objectStoreNames.contains('calculations')) {
                    const store = db.createObjectStore('calculations', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    
                    // Create indexes
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('expression', 'expression', { unique: false });
                }

                // Create object store for settings
                if (!db.objectStoreNames.contains('settings')) {
                    const settingsStore = db.createObjectStore('settings', { 
                        keyPath: 'key' 
                    });
                }
            };
        });
    }

    async saveCalculation(expression, result) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['calculations'], 'readwrite');
            const store = transaction.objectStore('calculations');
            
            const calculation = {
                expression: expression,
                result: result,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString('id-ID'),
                time: new Date().toLocaleTimeString('id-ID')
            };

            const request = store.add(calculation);

            request.onsuccess = () => {
                console.log('Calculation saved:', calculation);
                resolve(calculation);
            };

            request.onerror = () => {
                console.error('Error saving calculation:', request.error);
                reject(request.error);
            };
        });
    }

    async getCalculationHistory(limit = 50) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['calculations'], 'readonly');
            const store = transaction.objectStore('calculations');
            const index = store.index('timestamp');
            
            const request = index.openCursor(null, 'prev'); // Get latest first
            const results = [];
            let count = 0;

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && count < limit) {
                    results.push(cursor.value);
                    count++;
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = () => {
                console.error('Error getting history:', request.error);
                reject(request.error);
            };
        });
    }

    async clearHistory() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['calculations'], 'readwrite');
            const store = transaction.objectStore('calculations');
            
            const request = store.clear();

            request.onsuccess = () => {
                console.log('History cleared');
                resolve();
            };

            request.onerror = () => {
                console.error('Error clearing history:', request.error);
                reject(request.error);
            };
        });
    }

    async saveSetting(key, value) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            
            const setting = { key: key, value: value };
            const request = store.put(setting);

            request.onsuccess = () => {
                resolve(setting);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getSetting(key) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result ? request.result.value : null);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async searchHistory(searchTerm) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['calculations'], 'readonly');
            const store = transaction.objectStore('calculations');
            
            const request = store.getAll();

            request.onsuccess = () => {
                const results = request.result.filter(calc => 
                    calc.expression.includes(searchTerm) || 
                    calc.result.toString().includes(searchTerm)
                );
                resolve(results.reverse()); // Latest first
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getStatistics() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['calculations'], 'readonly');
            const store = transaction.objectStore('calculations');
            
            const request = store.getAll();

            request.onsuccess = () => {
                const calculations = request.result;
                const stats = {
                    totalCalculations: calculations.length,
                    todayCalculations: calculations.filter(calc => 
                        calc.date === new Date().toLocaleDateString('id-ID')
                    ).length,
                    mostUsedOperations: this.getMostUsedOperations(calculations),
                    averageCalculationsPerDay: this.getAverageCalculationsPerDay(calculations)
                };
                resolve(stats);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    getMostUsedOperations(calculations) {
        const operations = {};
        calculations.forEach(calc => {
            const operators = calc.expression.match(/[+\-×÷]/g) || [];
            operators.forEach(op => {
                operations[op] = (operations[op] || 0) + 1;
            });
        });
        
        return Object.entries(operations)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([op, count]) => ({ operator: op, count }));
    }

    getAverageCalculationsPerDay(calculations) {
        if (calculations.length === 0) return 0;
        
        const dates = [...new Set(calculations.map(calc => calc.date))];
        return Math.round(calculations.length / dates.length * 100) / 100;
    }
}

// Initialize database
const calculatorDB = new CalculatorDatabase();