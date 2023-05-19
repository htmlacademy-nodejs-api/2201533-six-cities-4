import mongoose from 'mongoose';
import {User} from '../../types/user.type.js';

export interface UserDocument extends User, mongoose.Document {}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [15, 'Max length for username is 15']
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/ /, 'Email is incorrect']
  },
  avatarPath: {
    type: String
  },
  password: {
    type: String,
    required: true,
    maxlength: [12, 'Max length for username is 12'],
    minlength: [6, 'Min length for username is 6']
  },
  type: {
    type: String,
    required: true
  }
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
// Имя. Обязательное. Мин. длина 1 символ, макс. длина 15 символов;
// Электронная почта. Обязательное. Валидный адрес электронной почты;
// Аватар пользователя. Необязательное. Изображение пользователя в формате .jpg или .png;
// Пароль. Обязательное. Мин. длина 6 символов, макс. длина 12 символов;
// Тип пользователя. Обязательное. Возможные варианты: обычный, pro.
