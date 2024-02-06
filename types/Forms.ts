import { IconProp } from "@fortawesome/fontawesome-svg-core"


export type RegisterFormData = {
    email: string,
    password: string,
    confirmPassword: string,
    user_name: string,
    full_name: string,
}

export type LoginFormData = {
    email: string,
    password: string,
}

export type ForgotPasswordFormData = {
    password: string,
    confirmPassword: string,
}

export type ResetLinkFormData = {
    email: string
}

export type InfoFormData = {
    user_name: string,
    full_name: string,
    location?: string | undefined,
    bio?: string | undefined
    bgType?: string,
    bgColor?: string,
    textColor: string,
}

export type ButtonFormData = {
    buttons: {
        key: string,
        value: string,
        label: string,
        icon?: any,
        placeholder: string,
    }[]
}

export type LinkFormData = {
    links: {
        key: string,
        title: string,
        subtitle?: string,
        icon?: string,
        url: string,
        value?: string,
        bgColor?: string,
        textColor?: string,
    }[]
}
