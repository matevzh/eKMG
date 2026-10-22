import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { CalendarDays, ChevronDown, ChevronLeft, AlertCircle, Check, type LucideIcon } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { C, F } from "@/constants/theme";

export function EarTag({ children, size = 12 }: { children: ReactNode; size?: number }) {
  return (
    <View style={styles.earTag}>
      <Text style={[styles.earTagText, { fontSize: size }]}>{children}</Text>
    </View>
  );
}

export function StatePicker({
  label,
  enabledLabel,
  disabledLabel,
  tone,
  value,
  onChange,
  saving,
}: {
  label: string;
  enabledLabel: string;
  disabledLabel: string;
  tone: "green" | "amber";
  value: boolean;
  onChange: (value: boolean) => void;
  saving?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const valueLabel = value ? enabledLabel : disabledLabel;
  const backgroundColor = value ? (tone === "amber" ? "#EFE6D6" : "#E7EFE3") : "#E9E5DC";
  const foregroundColor = value ? (tone === "amber" ? C.amber : C.green) : C.soil;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        disabled={saving}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Spremeni stanje: ${valueLabel}`}
        accessibilityHint="Izberi Da ali Ne"
        style={({ pressed }) => [
          styles.statePickerButton,
          { backgroundColor },
          pressed && styles.pressed,
        ]}
      >
        {saving ? (
          <ActivityIndicator size="small" color={foregroundColor} />
        ) : (
          <>
            <Text style={[styles.statePickerText, { color: foregroundColor }]}>{valueLabel}</Text>
            <ChevronDown size={16} color={foregroundColor} />
          </>
        )}
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.modalTitle}>{label}</Text>
            {[true, false].map((option) => {
              const active = option === value;
              const optionLabel = option ? enabledLabel : disabledLabel;
              return (
                <Pressable
                  key={String(option)}
                  style={styles.optionRow}
                  onPress={() => {
                    setOpen(false);
                    if (option !== value) onChange(option);
                  }}
                >
                  <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{optionLabel}</Text>
                  {active && <Check size={16} color={C.green} />}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export function TopBar({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={8} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <ChevronLeft size={22} color={C.green} />
          </Pressable>
        )}
        <Text numberOfLines={1} style={styles.topBarTitle}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}

export function Card({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function Row({
  label,
  value,
  icon: Icon,
  compact,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  compact?: boolean;
}) {
  return (
    <View style={[styles.row, { paddingVertical: compact ? 4 : 6 }]}>
      <View style={styles.rowLabelWrap}>
        {Icon && <Icon size={13} color={C.soil} />}
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <Card>
      <View style={styles.emptyRow}>
        <AlertCircle size={14} color={C.faint} />
        <Text style={styles.emptyText}>{text}</Text>
      </View>
    </Card>
  );
}

export function PillTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <View style={styles.pillRow}>
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
          >
            <Text style={[styles.pillText, { color: isActive ? C.paper : C.ink }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  error,
  prefix,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "words" | "sentences" | "characters";
  error?: string;
  prefix?: string;
}) {
  const input = (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.faint}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      style={prefix ? styles.fieldInputInner : [styles.fieldInput, error && styles.fieldInputError]}
    />
  );

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {prefix ? (
        <View style={[styles.fieldInput, styles.fieldInputPrefixed, error && styles.fieldInputError]}>
          <Text style={styles.fieldPrefix}>{prefix}</Text>
          {input}
        </View>
      ) : (
        input
      )}
      {error && <Text style={styles.fieldErrorText}>{error}</Text>}
    </View>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = "Izberi…",
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable onPress={() => setOpen(true)} style={styles.selectInput}>
        <Text style={[styles.selectValue, !selected && styles.selectPlaceholder]}>
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={16} color={C.faint} />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(o) => o.value}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const active = item.value === value;
                return (
                  <Pressable
                    style={styles.optionRow}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{item.label}</Text>
                    {active && <Check size={16} color={C.green} />}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DateField({
  label,
  value,
  onChange,
  placeholder = "Izberi datum…",
}: {
  label: string;
  value: string; // YYYY-MM-DD or ""
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const current = value ? new Date(`${value}T00:00:00`) : new Date();

  function onAndroidChange(event: DateTimePickerEvent, selected?: Date) {
    setShow(false);
    if (event.type === "set" && selected) {
      onChange(toISODate(selected));
    }
  }

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable onPress={() => setShow(true)} style={styles.selectInput}>
        <Text style={[styles.selectValue, !value && styles.selectPlaceholder]}>{value || placeholder}</Text>
        <CalendarDays size={16} color={C.faint} />
      </Pressable>

      {show && Platform.OS !== "ios" && (
        <DateTimePicker value={current} mode="date" onChange={onAndroidChange} maximumDate={new Date()} />
      )}

      {Platform.OS === "ios" && (
        <Modal visible={show} transparent animationType="fade" onRequestClose={() => setShow(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setShow(false)}>
            <Pressable style={styles.modalSheet} onPress={() => {}}>
              <DateTimePicker
                value={current}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(_, selected) => selected && onChange(toISODate(selected))}
              />
              <Pressable style={styles.dateDoneButton} onPress={() => setShow(false)}>
                <Text style={styles.dateDoneText}>Končano</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

export function SecondaryButton({ 
  label, 
  onPress, 
  loading 
}: { 
  label: string;
  onPress: () => void; 
  loading?: boolean 
}) {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.secondaryButton, 
        pressed && styles.pressed,
        ]}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
      {loading && <ActivityIndicator size="small" color={C.green} />}
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const isInactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.primaryButton,
        isInactive && styles.primaryButtonDisabled,
        pressed && !isInactive && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color={C.paper} /> : <Text style={styles.primaryButtonText}>{label}</Text>}
    </Pressable>
  );
}

// A tappable checkbox with an arbitrary label (e.g. consent text with inline
// links). The whole row toggles; links inside the label handle their own taps.
export function Checkbox({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable onPress={onToggle} hitSlop={4} style={styles.checkboxRow}>
      <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
        {checked && <Check size={14} color={C.paper} />}
      </View>
      <View style={styles.checkboxLabel}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  earTag: {
    alignSelf: "flex-start",
    backgroundColor: C.mist,
    borderWidth: 1,
    borderColor: C.sage,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  earTagText: {
    fontFamily: F.mono,
    color: C.green,
    letterSpacing: 0.5,
  },
  statePickerText: {
    fontSize: 11,
    fontFamily: F.sansMedium,
  },
  statePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 5,
    borderRadius: 999,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: C.bg,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
    borderRadius: 999,
  },
  topBarTitle: {
    fontFamily: F.display,
    fontSize: 20,
    color: C.ink,
    flexShrink: 1,
  },
  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 14,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },
  sectionLabel: {
    color: C.soil,
    fontSize: 11,
    fontFamily: F.sansSemiBold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowLabel: {
    color: C.muted,
    fontSize: 12.5,
    fontFamily: F.sans,
  },
  rowValue: {
    color: C.ink,
    fontSize: 12.5,
    fontFamily: F.sansMedium,
    textAlign: "right",
    maxWidth: "60%",
  },
  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    color: C.faint,
    fontSize: 12.5,
    fontFamily: F.sans,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: C.green,
    borderColor: C.green,
  },
  pillInactive: {
    backgroundColor: C.card,
    borderColor: C.line,
  },
  pillText: {
    fontSize: 12,
    fontFamily: F.sansMedium,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    color: C.soil,
    fontSize: 12,
    fontFamily: F.sansMedium,
  },
  fieldInput: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: F.sans,
    color: C.ink,
  },
  fieldInputError: {
    borderColor: C.red,
  },
  fieldInputPrefixed: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
    paddingRight: 0,
  },
  fieldPrefix: {
    fontSize: 15,
    fontFamily: F.sansSemiBold,
    color: C.soil,
    marginRight: 6,
  },
  fieldInputInner: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: F.sans,
    color: C.ink,
  },
  dateDoneButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dateDoneText: {
    color: C.green,
    fontSize: 15,
    fontFamily: F.sansSemiBold,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectValue: {
    fontSize: 15,
    fontFamily: F.sans,
    color: C.ink,
  },
  selectPlaceholder: {
    color: C.faint,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(35, 48, 31, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  modalSheet: {
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxHeight: "70%",
  },
  modalTitle: {
    color: C.soil,
    fontSize: 12,
    fontFamily: F.sansSemiBold,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  optionLabel: {
    fontSize: 15,
    fontFamily: F.sans,
    color: C.ink,
  },
  optionLabelActive: {
    fontFamily: F.sansSemiBold,
    color: C.green,
  },
  fieldErrorText: {
    color: C.red,
    fontSize: 12,
    fontFamily: F.sans,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.line,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxBoxChecked: {
    backgroundColor: C.green,
    borderColor: C.green,
  },
  checkboxLabel: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: C.green,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: C.paper,
    fontSize: 15,
    fontFamily: F.sansSemiBold,
  },
  secondaryButton: {
    backgroundColor: C.card,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: F.sansSemiBold,
  },
});
