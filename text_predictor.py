"""
INCLU Text Predictor - Prediccion de texto en español
Autocompletado, corrección y sugerencias basadas en frecuencia.
"""
import os
import json
from collections import defaultdict, Counter
import math


class TextPredictor:
    def __init__(self):
        self.word_freq = Counter()
        self.bigram_freq = defaultdict(Counter)
        self.trigram_freq = defaultdict(Counter)
        self.word_list = []
        self.load_dictionary()
        self.load_ngrams()

    def load_dictionary(self):
        dict_path = os.path.join(os.path.dirname(__file__), "dictionary.json")
        if os.path.exists(dict_path):
            with open(dict_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.word_freq = Counter(data.get("word_freq", {}))
                self.word_list = list(self.word_freq.keys())
            return

        common_words = [
            "el", "la", "los", "las", "un", "una", "de", "del", "al", "en",
            "con", "por", "para", "sin", "sobre", "entre", "hasta", "desde",
            "yo", "tu", "el", "ella", "nosotros", "ustedes", "ellos",
            "este", "esta", "estos", "estas", "ese", "esa", "esos", "esas",
            "que", "como", "donde", "cuando", "quien", "cual", "cuanto",
            "y", "o", "pero", "sino", "porque", "si", "no", "ya", "tambien",
            "muy", "mas", "menos", "tan", "todo", "nada", "algo", "mucho",
            "poco", "cada", "otro", "mismo", "demasiado", "bastante",
            "hacer", "tener", "poder", "decir", "ir", "ver", "dar", "saber",
            "querer", "llegar", "poner", "parecer", "quedar", "creer",
            "hablar", "llevar", "dejar", "seguir", "encontrar", "llamar",
            "venir", "pensar", "salir", "volver", "tomar", "conocer",
            "vivir", "sentir", "tratar", "mirar", "contar", "empezar",
            "esperar", "buscar", "existir", "entrar", "pasar", "recordar",
            "perder", "producir", "entender", "llevar",
            "bien", "mal", "rapido", "lento", "grande", "pequeno",
            "nuevo", "viejo", "bueno", "malo", "bonito", "feo",
            "hola", "adios", "gracias", "porfavor", "de nada",
            "buenos", "dias", "tardes", "noches", "manana", "hoy",
            "como", "estas", "bien", "mal", "regular",
            "nombre", "edad", "año", "mes", "dia", "hora",
            "casa", "escuela", "trabajo", "ciudad", "pais",
            "agua", "comida", "tiempo", "amigo", "familia",
            "mama", "papa", "hermano", "hermana", "hijo", "hija",
            "senor", "senora", "joven", "nino", "nina",
            "leer", "escribir", "hablar", "escuchar", "estudiar",
            "aprender", "enseñar", "entender", "practicar",
            "mano", "dedo", "brazo", "cabeza", "ojo", "boca",
            "seña", "letra", "palabra", "oracion", "texto",
            "si", "no", "tal", "vez", "claro", "exacto",
            "uno", "dos", "tres", "cuatro", "cinco",
            "primero", "segundo", "tercero", "ultimo",
            "izquierda", "derecha", "arriba", "abajo",
            "adentro", "afuera", "cerca", "lejos",
            "ahora", "antes", "despues", "siempre", "nunca",
            "aqui", "ahi", "alla", "luego", "todavia",
            "poder", "necesitar", "gustar", "preferir",
            "favorito", "mejor", "peor", "igual", "diferente",
            "facil", "dificil", "importante", "necesario",
            "feliz", "triste", "enojado", "asustado",
            "comer", "beber", "dormir", "caminar", "correr",
            "trabajar", "jugar", "descansar", "viajar",
            "limpiar", "cocinar", "comprar", "vender",
            "llorar", "reir", "cantar", "bailar",
            "pensar", "sentir", "creer", "saber",
            "comprender", "explicar", "preguntar", "responder",
            "comenzar", "terminar", "continuar", "parar",
            "abrir", "cerrar", "entrar", "salir",
            "subir", "bajar", "avanzar", "retroceder",
            "enviar", "recibir", "llamar", "contestar",
            "mostrar", "esconder", "encontrar", "perder",
            "ganar", "jugar", "competir",
            "crear", "destruir", "construir", "reparar",
            "compartir", "guardar", "usar", "necesitar",
            "tmpl", "plantilla", "ejemplo", "modelo",
            "video", "audio", "imagen", "foto",
            "computadora", "celular", "pantalla", "teclado",
            "internet", "pagina", "correo", "mensaje",
            "musica", "pelicula", "juego", "libro",
            "tiempo", "clima", "lluvia", "sol", "nube",
            "colores", "rojo", "azul", "verde", "amarillo",
            "numeros", "suma", "resta", "multiplicar",
            "letras", "abecedario", "alfabeto",
            "abecedario", "LSN", "nicaragua", "senas",
            "sordo", "auditivo", "comunicacion", "lenguaje",
            "interprete", "traducir", "entender", "comunicar",
            "mario", "alejandro", "jona", "jonathan", "zayri",
            "carlos", "pedro", "jose", "luis", "maria",
            "ana", "rosa", "laura", "sofia", "valeria",
            "diego", "andres", "miguel", "daniel", "david",
            "elena", "carmen", "lucia", "paula", "isabella",
            "te amo", "te quiero", "por favor", "gracias",
            "buenos dias", "buenas tardes", "buenas noches",
            "como estas", "como te va", "que tal",
            "nos vemos", "hasta luego", "hasta manana",
            "con permiso", "perdon", "disculpa",
            "feliz cumpleaños", "felicidades", "salud",
            "yo se", "tu sabes", "el sabe",
            "que hora es", "donde estas", "quien eres",
            "me llamo", "mi nombre es", "tengo hambre",
            "tengo sed", "tengo frio", "tengo calor",
            "no entiendo", "repiti por favor",
            "mas lento", "mas rapido", "otra vez",
            "cuenta otra", "explica otra", "enseña otra",
        ]
        for w in common_words:
            self.word_freq[w] = max(self.word_freq.get(w, 0), 100)
        self.word_list = list(self.word_freq.keys())

    def load_ngrams(self):
        for i, word in enumerate(self.word_list):
            if i > 0:
                self.bigram_freq[self.word_list[i-1]][word] += self.word_freq[word]
            if i > 1:
                self.trigram_freq[(self.word_list[i-2], self.word_list[i-1])][word] += self.word_freq[word]

    def edit_distance(self, s1, s2):
        if len(s1) < len(s2):
            return self.edit_distance(s2, s1)
        if len(s2) == 0:
            return len(s1)
        prev_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            curr_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = prev_row[j + 1] + 1
                deletions = curr_row[j] + 1
                substitutions = prev_row[j] + (c1 != c2)
                curr_row.append(min(insertions, deletions, substitutions))
            prev_row = curr_row
        return prev_row[-1]

    def correct_word(self, word):
        word_lower = word.lower()
        if word_lower in self.word_freq:
            return word_lower

        candidates = []
        for w in self.word_list:
            dist = self.edit_distance(word_lower, w)
            if dist <= 2:
                score = self.word_freq[w] / (dist + 1)
                candidates.append((w, score, dist))

        if candidates:
            candidates.sort(key=lambda x: (-x[1], x[2]))
            return candidates[0][0]

        return word_lower

    def get_suggestions(self, partial, max_suggestions=5):
        partial_lower = partial.lower()
        if not partial_lower:
            return []

        suggestions = []
        for w in self.word_list:
            if w.startswith(partial_lower) and w != partial_lower:
                score = self.word_freq[w] * (1.0 / (1 + len(w) - len(partial_lower)))
                suggestions.append((w, score))
            elif partial_lower in w and len(w) < len(partial_lower) + 8:
                score = self.word_freq[w] * 0.5
                suggestions.append((w, score))

        suggestions.sort(key=lambda x: -x[1])
        seen = set()
        result = []
        for w, s in suggestions:
            if w not in seen:
                seen.add(w)
                result.append(w)
            if len(result) >= max_suggestions:
                break
        return result

    def predict_next_word(self, context_words, max_predictions=5):
        if not context_words:
            top = self.word_freq.most_common(max_predictions)
            return [w for w, f in top]

        last_word = context_words[-1].lower()
        predictions = []

        if len(context_words) >= 2:
            bigram_key = (context_words[-2].lower(), last_word)
            if bigram_key in self.trigram_freq:
                for word, freq in self.trigram_freq[bigram_key].most_common(max_predictions * 2):
                    score = freq / self.word_freq.get(word, 1)
                    predictions.append((word, score))

        if last_word in self.bigram_freq:
            for word, freq in self.bigram_freq[last_word].most_common(max_predictions * 2):
                score = freq / self.word_freq.get(word, 1) * 0.8
                predictions.append((word, score))

        seen = set()
        result = []
        for word, score in sorted(predictions, key=lambda x: -x[1]):
            if word not in seen and word != last_word:
                seen.add(word)
                result.append(word)
            if len(result) >= max_predictions:
                break

        return result

    def complete_word(self, partial):
        return self.get_suggestions(partial, max_suggestions=3)

    def get_context_predictions(self, text, max_predictions=5):
        words = text.strip().split()
        return self.predict_next_word(words, max_predictions)


if __name__ == "__main__":
    predictor = TextPredictor()
    print("Diccionario cargado:", len(predictor.word_list), "palabras")
    print("\nSugerencias para 'ho':", predictor.get_suggestions("ho"))
    print("Correccion para 'grazias':", predictor.correct_word("grazias"))
    print("Prediccion despues de 'buenos':", predictor.get_context_predictions("buenos"))
    print("Prediccion despues de 'buenos dias':", predictor.get_context_predictions("buenos dias"))
    print("Completado 'par':", predictor.complete_word("par"))
