type ValueOf<T> = T[keyof T];

type KeyOfType<T, V> = keyof {
	[P in keyof T as T[P] extends V ? P : never]: V;
};
