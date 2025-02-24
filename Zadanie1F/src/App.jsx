import * as yup from 'yup';
import { useState, useEffect, useRef } from 'react';
import styles from './App.module.css';

const emailChangeScheme = yup
	.string()
	.matches(
		/^[a-zA-Z0-9_@.]+$/,
		'Неверный email.Допустимые символы - латинские буквы, цифры и нижнее подчеркивание',
	)
	.max(30, 'Неверный email. Должно быть меньше 30 символов.')
	.min(3, 'Неверный email. Должно быть больше 3 символов.');
const passwordChangeScheme = yup
	.string()
	.min(5, 'Пароль должен быть не менее 5 символов.');

const validateAndGetErrorMessange = (scheme, value) => {
	try {
		scheme.validateSync(value);
		return null;
	} catch ({ errors }) {
		return errors;
	}
};
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
		}
	};

	const checkingValidityEmail = (value) => {
		const error = validateAndGetErrorMessange(emailChangeScheme, value);
		setErrorEmail(error);
	};

	useEffect(() => {
		let error = null;
		const passwordError = validateAndGetErrorMessange(passwordChangeScheme, password);

		if (password2 && password !== password2) {
			error = 'Пароли не совпадают. Проверьте правильность ввода';
		} else {
			error = passwordError;
		}

		setErrorPassword(error);

		if (
			!errorEmail &&
			!errorPassword &&
			password &&
			password2 &&
			password === password2 &&
			sumbitButtonRef.current
		) {
			setTimeout(() => {
				sumbitButtonRef.current?.focus();
			}, 0);
		}
	}, [password, password2, email, errorEmail, errorPassword]);

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
				{errorEmail && (
					<div className={styles.error}>
						{errorEmail.map((err, index) => (
							<li key={index}>{err}</li>
						))}
					</div>
				)}
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
