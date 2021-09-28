import { Entity, IEntitySettings, IEntityPrivate } from "../../../core/util/Entity";
import type { Sprite } from "../../../core/render/Sprite";
import type { Axis } from "./Axis";
import type { AxisRenderer } from "./AxisRenderer";

export interface IAxisBulletSettings extends IEntitySettings {

	/**
	 * Relative location of the bullet within the cell.
	 *
	 * `0` - beginning, `0.5` - middle, `1` - end.
	 */
	location?: number;

	/**
	 * A visual element of the bullet.
	 */
	sprite: Sprite;
}

export interface IAxisBulletPrivate extends IEntityPrivate {
}

/**
 * Draws a bullet on an axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Axis_bullets} for more info
 */
export class AxisBullet extends Entity {

	/**
	 * Target axis object.
	 */
	public axis: Axis<AxisRenderer> | undefined;

	declare public _settings: IAxisBulletSettings;
	declare public _privateSettings: IAxisBulletPrivate;

	public static className: string = "AxisBullet";
	public static classNames: Array<string> = Entity.classNames.concat([AxisBullet.className]);

	public _beforeChanged() {
		super._beforeChanged();

		const sprite = this.get("sprite");

		if (this.isDirty("sprite")) {
			if (sprite) {
				sprite.setAll({ position: "absolute", role: "figure" });
				this._disposers.push(sprite);
			}
		}

		if (this.isDirty("location")) {
			const dataItem = sprite.dataItem;
			if (this.axis && sprite && dataItem) {
				this.axis._prepareDataItem(dataItem as any)
			}
		}
	}
}
