// src/screens/CustomerFormModal.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from "react-native";
import Icon from "../components/Icon";
import { Button } from "../components/ui";
import { colors, spacing, radii, shadow } from "../constants/theme";
import { useScale } from "../hooks/useScale";
export default function CustomerFormModal({
    visible,
    onClose,
    onSubmit,
    loading,
    requireSubmit = false,
    resetToken = 0,
}) {
    const { s, fs, isTablet, W, H } = useScale();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        contactNumber: "",
        preferredDate: "",
        consentGiven: false,
    });
    const [errors, setErrors] = useState({});
    const [focused, setFocused] = useState("");
    const canClose = !requireSubmit && !loading;

    useEffect(() => {
        setForm({
            fullName: "",
            email: "",
            contactNumber: "",
            preferredDate: "",
            consentGiven: false,
        });
        setErrors({});
        setFocused("");
    }, [resetToken]);

    const set = (field) => (value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    function validate() {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Required";
        if (!form.email.trim()) e.email = "Required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
        if (!form.contactNumber.trim()) e.contactNumber = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit() {
        if (!validate()) return;
        onSubmit({
            fullName: form.fullName.trim(),
            email: form.email.trim().toLowerCase(),
            contactNumber: form.contactNumber.trim(),
            preferredDate: form.preferredDate.trim() || null,
            consentGiven: form.consentGiven,
        });
    }

    const isValid = form.fullName && form.email && form.contactNumber;

    // ── TABLET: centered fixed dialog, no scroll ─────────────────────────────────
    // All sizes are raw dp values (not scaled) so they don't balloon on large screens
    if (isTablet) {
        const dialogW = Math.min(600, W * 0.75);
        const inp = (field) => ({
            borderWidth: 1.5,
            borderColor: focused === field ? colors.accent : colors.border,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 9,
            fontSize: 14,
            color: colors.foreground,
            backgroundColor: "#fff",
        });

        return (
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={canClose ? onClose : undefined}
            >
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={canClose ? onClose : undefined}
                >
                    <Pressable onPress={(e) => e.stopPropagation()}>
                        <View
                            style={{
                                width: dialogW,
                                backgroundColor: "#fff",
                                borderRadius: 16,
                                overflow: "hidden",
                                ...shadow.lg,
                            }}
                        >
                            {/* ── Header ── */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    paddingHorizontal: 20,
                                    paddingVertical: 14,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.border,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "700",
                                        color: colors.foreground,
                                    }}
                                    allowFontScaling={false}
                                >
                                    Customer Information
                                </Text>
                                {canClose ? (
                                    <TouchableOpacity
                                        onPress={onClose}
                                        style={{ padding: 6 }}
                                    >
                                        <Icon
                                            name="close"
                                            size={18}
                                            color={colors.mutedForeground}
                                        />
                                    </TouchableOpacity>
                                ) : null}
                            </View>

                            {/* ── Body ── */}
                            <View style={{ padding: 20, gap: 12 }}>
                                {/* Row 1: Full Name + Email */}
                                <View style={{ flexDirection: "row", gap: 12 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: 11,
                                                fontWeight: "600",
                                                color: colors.mutedForeground,
                                                marginBottom: 5,
                                                textTransform: "uppercase",
                                                letterSpacing: 0.4,
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Full Name{" "}
                                            <Text
                                                style={{ color: colors.error }}
                                            >
                                                *
                                            </Text>
                                        </Text>
                                        <TextInput
                                            style={inp("name")}
                                            value={form.fullName}
                                            onChangeText={set("fullName")}
                                            placeholder="Enter your full name"
                                            autoCapitalize="words"
                                            placeholderTextColor={
                                                colors.mutedForeground
                                            }
                                            allowFontScaling={false}
                                            onFocus={() => setFocused("name")}
                                            onBlur={() => setFocused("")}
                                        />
                                        {errors.fullName ? (
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    color: colors.error,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {errors.fullName}
                                            </Text>
                                        ) : null}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: 11,
                                                fontWeight: "600",
                                                color: colors.mutedForeground,
                                                marginBottom: 5,
                                                textTransform: "uppercase",
                                                letterSpacing: 0.4,
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Email{" "}
                                            <Text
                                                style={{ color: colors.error }}
                                            >
                                                *
                                            </Text>
                                        </Text>
                                        <TextInput
                                            style={inp("email")}
                                            value={form.email}
                                            onChangeText={set("email")}
                                            placeholder="example@email.com"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            placeholderTextColor={
                                                colors.mutedForeground
                                            }
                                            allowFontScaling={false}
                                            onFocus={() => setFocused("email")}
                                            onBlur={() => setFocused("")}
                                        />
                                        {errors.email ? (
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    color: colors.error,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {errors.email}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>

                                {/* Row 2: Contact + Preferred Date */}
                                <View style={{ flexDirection: "row", gap: 12 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: 11,
                                                fontWeight: "600",
                                                color: colors.mutedForeground,
                                                marginBottom: 5,
                                                textTransform: "uppercase",
                                                letterSpacing: 0.4,
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Contact Number{" "}
                                            <Text
                                                style={{ color: colors.error }}
                                            >
                                                *
                                            </Text>
                                        </Text>
                                        <TextInput
                                            style={inp("contact")}
                                            value={form.contactNumber}
                                            onChangeText={set("contactNumber")}
                                            placeholder="+63 9XX XXX XXXX"
                                            keyboardType="phone-pad"
                                            placeholderTextColor={
                                                colors.mutedForeground
                                            }
                                            allowFontScaling={false}
                                            onFocus={() =>
                                                setFocused("contact")
                                            }
                                            onBlur={() => setFocused("")}
                                        />
                                        {errors.contactNumber ? (
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    color: colors.error,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {errors.contactNumber}
                                            </Text>
                                        ) : null}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: 11,
                                                fontWeight: "600",
                                                color: colors.mutedForeground,
                                                marginBottom: 5,
                                                textTransform: "uppercase",
                                                letterSpacing: 0.4,
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Preferred Date (optional)
                                        </Text>
                                        <TextInput
                                            style={inp("date")}
                                            value={form.preferredDate}
                                            onChangeText={set("preferredDate")}
                                            placeholder="YYYY-MM-DD"
                                            placeholderTextColor={
                                                colors.mutedForeground
                                            }
                                            allowFontScaling={false}
                                            onFocus={() => setFocused("date")}
                                            onBlur={() => setFocused("")}
                                        />
                                    </View>
                                </View>

                                {/* Consent */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        borderWidth: 1.5,
                                        borderColor: colors.border,
                                        borderRadius: 10,
                                        padding: 12,
                                        backgroundColor:
                                            "rgba(236,236,240,0.25)",
                                    }}
                                >
                                    <Switch
                                        value={form.consentGiven}
                                        onValueChange={set("consentGiven")}
                                        trackColor={{
                                            false: colors.muted,
                                            true: colors.accent,
                                        }}
                                        thumbColor="#fff"
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: colors.mutedForeground,
                                                lineHeight: 17,
                                            }}
                                            allowFontScaling={false}
                                        >
                                            I hereby consent to Heigen Studio
                                            releasing my photos on public and
                                            social media platforms.
                                        </Text>
                                    </View>
                                </View>

                                {/* Actions */}
                                <View style={{ flexDirection: "row", gap: 10 }}>
                                    {canClose ? (
                                        <Button
                                            label="Cancel"
                                            variant="secondary"
                                            onPress={onClose}
                                            size="sm"
                                            style={{
                                                flex: 1,
                                                height: 40,
                                                minHeight: 0,
                                            }}
                                            disabled={loading}
                                        />
                                    ) : null}
                                    <Button
                                        label="Continue"
                                        onPress={handleSubmit}
                                        disabled={!isValid || loading}
                                        size="sm"
                                        loading={loading}
                                        style={{
                                            flex: canClose ? 1 : 2,
                                            height: 40,
                                            minHeight: 0,
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        );
    }

    // ── PHONE: bottom sheet with scroll ──────────────────────────────────────────
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={canClose ? onClose : undefined}
        >
            <Pressable
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                onPress={canClose ? onClose : undefined}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            >
                <View
                    style={{
                        backgroundColor: "#fff",
                        borderTopLeftRadius: s(radii.xxl),
                        borderTopRightRadius: s(radii.xxl),
                        maxHeight: "92%",
                        ...shadow.lg,
                    }}
                >
                    <View
                        style={{
                            width: s(40),
                            height: s(4),
                            borderRadius: s(2),
                            backgroundColor: colors.border,
                            alignSelf: "center",
                            marginTop: s(spacing.md),
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingHorizontal: s(spacing.xxl),
                            paddingVertical: s(spacing.lg),
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border,
                        }}
                    >
                        <Text
                            style={{ fontSize: fs(18), fontWeight: "700" }}
                            allowFontScaling={false}
                        >
                            Customer Information
                        </Text>
                        {canClose ? (
                            <TouchableOpacity
                                onPress={onClose}
                                style={{ padding: s(spacing.sm) }}
                            >
                                <Icon
                                    name="close"
                                    size={s(22)}
                                    color={colors.mutedForeground}
                                />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <ScrollView
                        contentContainerStyle={{
                            padding: s(spacing.xxl),
                            paddingBottom: s(spacing.xxxl),
                        }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <PhoneField
                            label="Full Name"
                            required
                            error={errors.fullName}
                            s={s}
                            fs={fs}
                        >
                            <PhoneInput
                                value={form.fullName}
                                onChangeText={set("fullName")}
                                placeholder="Enter your full name"
                                autoCapitalize="words"
                                s={s}
                                fs={fs}
                            />
                        </PhoneField>
                        <PhoneField
                            label="Email Address"
                            required
                            error={errors.email}
                            s={s}
                            fs={fs}
                        >
                            <PhoneInput
                                value={form.email}
                                onChangeText={set("email")}
                                placeholder="example@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                s={s}
                                fs={fs}
                            />
                        </PhoneField>
                        <PhoneField
                            label="Contact Number"
                            required
                            error={errors.contactNumber}
                            s={s}
                            fs={fs}
                        >
                            <PhoneInput
                                value={form.contactNumber}
                                onChangeText={set("contactNumber")}
                                placeholder="+63 9XX XXX XXXX"
                                keyboardType="phone-pad"
                                s={s}
                                fs={fs}
                            />
                        </PhoneField>
                        <PhoneField
                            label="Preferred Date (optional)"
                            s={s}
                            fs={fs}
                        >
                            <PhoneInput
                                value={form.preferredDate}
                                onChangeText={set("preferredDate")}
                                placeholder="YYYY-MM-DD"
                                s={s}
                                fs={fs}
                            />
                        </PhoneField>
                        <View
                            style={{
                                backgroundColor: "rgba(236,236,240,0.4)",
                                borderWidth: 2,
                                borderColor: colors.border,
                                borderRadius: s(radii.xl),
                                padding: s(spacing.xl),
                                marginBottom: s(spacing.xl),
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "flex-start",
                                    gap: s(spacing.lg),
                                }}
                            >
                                <Switch
                                    value={form.consentGiven}
                                    onValueChange={set("consentGiven")}
                                    trackColor={{
                                        false: colors.muted,
                                        true: colors.accent,
                                    }}
                                    thumbColor="#fff"
                                />
                                <Text
                                    style={{
                                        fontSize: fs(13),
                                        color: colors.mutedForeground,
                                        flex: 1,
                                        lineHeight: fs(19),
                                    }}
                                    allowFontScaling={false}
                                >
                                    I hereby consent to Heigen Studio releasing
                                    my photos on public and social media
                                    platforms.
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{ flexDirection: "row", gap: s(spacing.lg) }}
                        >
                            {canClose ? (
                                <Button
                                    label="Cancel"
                                    variant="secondary"
                                    onPress={onClose}
                                    size="sm"
                                    style={{ flex: 1 }}
                                    disabled={loading}
                                />
                            ) : null}
                            <Button
                                label="Continue"
                                onPress={handleSubmit}
                                disabled={!isValid || loading}
                                size="sm"
                                loading={loading}
                                style={{ flex: canClose ? 1 : 2 }}
                            />
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

function PhoneField({ label, required, error, children, s, fs }) {
    return (
        <View style={{ marginBottom: s(spacing.xl) }}>
            <Text
                style={{
                    fontSize: fs(14),
                    fontWeight: "600",
                    marginBottom: s(spacing.sm),
                }}
                allowFontScaling={false}
            >
                {label}
                {required ? (
                    <Text style={{ color: colors.error }}> *</Text>
                ) : null}
            </Text>
            {children}
            {error ? (
                <Text
                    style={{
                        fontSize: fs(11),
                        color: colors.error,
                        marginTop: s(4),
                    }}
                >
                    {error}
                </Text>
            ) : null}
        </View>
    );
}

function PhoneInput({ s, fs, ...rest }) {
    const [focused, setFocused] = useState(false);
    return (
        <TextInput
            style={{
                borderWidth: 2,
                borderColor: focused ? colors.accent : colors.border,
                borderRadius: s(radii.lg),
                paddingHorizontal: s(spacing.xl),
                paddingVertical: s(spacing.lg),
                fontSize: fs(15),
                color: colors.foreground,
                backgroundColor: "#fff",
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholderTextColor={colors.mutedForeground}
            allowFontScaling={false}
            {...rest}
        />
    );
}
