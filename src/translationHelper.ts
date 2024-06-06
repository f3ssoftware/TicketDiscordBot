import * as fs from 'fs';
import * as path from 'path';

const translations: { [key: string]: any } = {};

function loadTranslations() {
    const localesPath = path.join(__dirname, 'locales');
    const files = fs.readdirSync(localesPath);
    files.forEach(file => {
        const filePath = path.join(localesPath, file);
        const language = path.basename(file, '.json');
        translations[language] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });
}

export function getTranslation(language: any, key: string): string {
    if (!translations[language]) {
        language = 'en'; // Fallback to English if the language is not found
    }
    return translations[language][key] || key;
}

loadTranslations(); // Load translations when the module is imported
