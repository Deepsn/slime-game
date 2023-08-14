import { Controller, Service, Reflect, Flamework } from "@flamework/core";

export const isFlameworkService = (obj: object): boolean =>
	Reflect.hasMetadata(obj, `flamework:decorators.${Flamework.id<typeof Service>()}`);

export const isFlameworkController = (obj: object): boolean =>
	Reflect.hasMetadata(obj, `flamework:decorators.${Flamework.id<typeof Controller>()}`);
