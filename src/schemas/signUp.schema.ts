import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(35, "Username cannot be more than 30 characters long.")
    .regex(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm, "username must not contain special characters")

export const emailValidation = z
    .email({message: 'Invalid email address.'})

export const passwordValidation = z
    .string().min(8, {message: "Password must be 8 characters."})
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, "Enter Valid Password.")

export const fullNameValidation = z
    .string()
    .min(3, {message: "Full name Must be at least 3 character long."})
    .max(30, {message: "Full name should not be more than 30 characters."})

export const signUpSchema = z.object({
    username: usernameValidation,
    fullName: fullNameValidation,
    email: emailValidation,
    password: passwordValidation
})