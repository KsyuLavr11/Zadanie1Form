import { useState, useEffect, useRef } from 'react';
import styles from './App.module.css';

const initialState = {
	email: '',
	password: '',
	password2: '',
};
const useStore = () => {
	const [state, setState] = useState(initialState);
	return {
		getState: () => state,
		updateState: (fieldName, newValue) => {
			setState({ ...state, [fieldName]: newValue });
		},
		resetState: () => {
			setState(initialState);
		},
	};
};
const sendData = (getState) => {
	console.log(getState());
};

export const App = () => {
	const { getState, updateState, resetState } = useStore();
	const { email, password, password2 } = getState();
	const [errorEmail, setErrorEmail] = useState(null);
	const [errorPassword, setErrorPassword] = useState(null);
	const sumbitButtonRef = useRef(null);

	const onSubmit = (event) => {
		event.preventDefault();
		sendData(getState);
	};

	const onChange = ({ target }) => {
		updateState(target.name, target.value);
		if (target.name === 'email') {
			checkingValidityEmail(target.value);
		} else if (target.name === 'password2') {
			checkingPasswordVerification();
		}
	};

	const checkingValidityEmail = (value) => {
		let error = null;
		if (!/^[a-zA-Z0-9_@.]+$/.test(value)) {
			error =
				'Неверный email.Допустимые символы - латинские буквы, цифры и нижнее подчеркивание';
		} else if (/@@/.test(value)) {
			error = 'Неверный email. Недопустима последовательность @@';
		} else if (value.length > 30) {
			error = 'Неверный email. Должно быть меньше 30 символов.';
		} else if (value.length < 3) {
			error = 'Неверный email. Должно быть больше 3 символов.';
		}
		setErrorEmail(error);
	};
	const checkingPasswordVerification = () => {
		let error = null;
		if (password2 !== password) {
			error = 'Пароли не совпадают. Проверьте правильность ввода';
		} else if (password.length < 5) {
			error = 'Пароль должен быть не менее 5 символов.';
		}
		return error;
	};
	useEffect(() => {
		if (password2 !== '' && password !== '') {
			const passwordError = checkingPasswordVerification();
			setErrorPassword(passwordError || null);
			if (passwordError === null && password2 === password) {
				setTimeout(() => {
					sumbitButtonRef.current?.focus();
				}, 0);
			}
		} else {
			setErrorPassword(null);
		}
	}, [password, password2]);

	return (
		<div>
			Сайт для регистрации
			<form onSubmit={onSubmit}>
				<input
					className={styles.input}
					type="email"
					name="email"
					value={email}
					placeholder="Почта"
					onChange={onChange}
				/>
				<input
					className={styles.input}
					type="password"
					name="password"
					value={password}
					placeholder="Пароль"
					onChange={onChange}
				/>
				<input
					className={styles.input}
					type="password"
					name="password2"
					value={password2}
					placeholder="Повторите пароль"
					onChange={onChange}
				/>
				{errorEmail && <div className={styles.error}>{errorEmail}</div>}
				{errorPassword && <div className={styles.error}>{errorPassword}</div>}
				<button className={styles.button} type="button" onClick={resetState}>
					Сброс
				</button>
				<button
					ref={sumbitButtonRef}
					className={styles.button}
					type="submit"
					disabled={errorEmail !== null || errorPassword !== null}
				>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
