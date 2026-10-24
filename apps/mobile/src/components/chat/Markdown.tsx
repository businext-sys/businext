import { Fragment } from "react";
import { StyleSheet, Text, View, type TextStyle } from "react-native";

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
const LIST_ITEM = /^\s*(?:[-*•]|\d+[.)])\s+/;

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(INLINE).map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <Text key={index} style={styles.bold}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        if (/^(\*[^*]+\*|_[^_]+_)$/.test(part)) {
          return (
            <Text key={index} style={styles.italic}>
              {part.slice(1, -1)}
            </Text>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

/**
 * Markdown basico de las respuestas del asistente: parrafos, listas,
 * negritas y cursivas.
 */
export function Markdown({ text, style }: { text: string; style: TextStyle }) {
  const paragraphs = text.split(/\n{2,}/);

  return (
    <View style={styles.container}>
      {paragraphs.map((paragraph, pIndex) => (
        <View key={pIndex} style={styles.paragraph}>
          {paragraph.split("\n").map((line, lIndex) => {
            const listItem = LIST_ITEM.exec(line);
            if (listItem) {
              return (
                <View key={lIndex} style={styles.listItem}>
                  <Text style={style}>•</Text>
                  <Text style={[style, styles.listText]}>
                    <Inline text={line.slice(listItem[0].length)} />
                  </Text>
                </View>
              );
            }
            return (
              <Text key={lIndex} style={style}>
                <Inline text={line} />
              </Text>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  paragraph: { gap: 2 },
  listItem: { flexDirection: "row", gap: 6 },
  listText: { flex: 1 },
  bold: { fontWeight: "700" },
  italic: { fontStyle: "italic" },
});
