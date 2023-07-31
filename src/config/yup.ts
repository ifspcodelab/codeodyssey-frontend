import * as Yup from "yup";
import i18n from "../locales/i18n";

// https://github.com/arfurlaneto/yup-locale-pt/blob/master/src/locale.ts
const locale = {
    mixed: {
        default: i18n.t("yup.mixed_invalid_field"),
        required: i18n.t("yup.mixed_required_field"),
        notType: i18n.t("yup.mixed_not_type"),
        oneOf: i18n.t("yup.mixed_one_of"),
        max: i18n.t("yup.mixed_max"),
        min: i18n.t("yup.mixed_min"),
        defined: i18n.t("yup.mixed_defined"),
        notNull: i18n.t("yup.mixed_not_null"),
    },
    string: {
        email: i18n.t("yup.string_email"),
        max: i18n.t("yup.string_max"),
        min: i18n.t("yup.string_min"),
        matches: i18n.t("yup.string_matches"),
        length: i18n.t("yup.string_length"),
        url: i18n.t("yup.string_url"),
        uuid: i18n.t("yup.string_uuid"),
        trim: i18n.t("yup.string_trim"),
        lowercase: i18n.t("yup.string_lowercase"),
        uppercase: i18n.t("yup.string_uppercase"),
    },
    number: {
        max: i18n.t("yup.number_max"),
        min: i18n.t("yup.number_min"),
        lessThan: i18n.t("yup.number_less_than"),
        moreThan: i18n.t("yup.number_more_than"),
        notEqual: i18n.t("yup.number_not_equal"),
        positive: i18n.t("yup.number_positive"),
        negative: i18n.t("yup.number_negative"),
        integer: i18n.t("yup.number_integer"),
    },
    date: {
        min: i18n.t("yup.date_min"),
        max: i18n.t("yup.date_max"),
    },
    boolean: {
        isValue: i18n.t("yup.boolean_is_value")
    },
    object: {
        noUnknown: i18n.t("yup.object_no_unknown")
    },
    array: {
        min: i18n.t("yup.array_min"),
        max: i18n.t("yup.array_max"),
        length: i18n.t("yup.array_length"),
    }
};

Yup.setLocale(locale);

export default Yup;