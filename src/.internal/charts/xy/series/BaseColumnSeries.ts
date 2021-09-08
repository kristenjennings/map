import type { DataItem } from "../../../core/render/Component";
import type { Graphics } from "../../../core/render/Graphics";
import type { Template } from "../../../core/util/Template";
import type { ListTemplate } from "../../../core/util/List";
import type { CategoryAxis } from "../axes/CategoryAxis";
import type { DateAxis } from "../axes/DateAxis";
import type { ValueAxis } from "../axes/ValueAxis";
import type { ILegendDataItem } from "../../../core/render/Legend";
import type { Sprite } from "../../../core/render/Sprite";

import { XYSeries, IXYSeriesPrivate, IXYSeriesSettings, IXYSeriesDataItem, IXYSeriesAxisRange } from "./XYSeries";
import { Percent } from "../../../core/util/Percent";

import * as $array from "../../../core/util/Array";
import * as $type from "../../../core/util/Type";

export interface IBaseColumnSeriesDataItem extends IXYSeriesDataItem {
	graphics?: Graphics;
	rangeGraphics?: Array<Graphics>;
	legendDataItem: DataItem<ILegendDataItem>;
}

export interface IBaseColumnSeriesSettings extends IXYSeriesSettings {

	/**
	 * Indicates if series must divvy up available space with other column
	 * series (`true`; default) or take up the whole available space (`false`).
	 *
	 * @default true
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/column-series/#Clustering} for more info
	 */
	clustered?: boolean;

}

export interface IBaseColumnSeriesPrivate extends IXYSeriesPrivate {
}

export interface IBaseColumnSeriesAxisRange extends IXYSeriesAxisRange {

	/**
	 * List of columns.
	 */
	columns: ListTemplate<Graphics>;
}

/**
 * Base class for all "column-based" series
 */
export abstract class BaseColumnSeries extends XYSeries {

	declare public _settings: IBaseColumnSeriesSettings;
	declare public _privateSettings: IBaseColumnSeriesPrivate;
	declare public _dataItemSettings: IBaseColumnSeriesDataItem;
	declare public _axisRangeType: IBaseColumnSeriesAxisRange;

	public static className: string = "BaseColumnSeries";
	public static classNames: Array<string> = XYSeries.classNames.concat([BaseColumnSeries.className]);

	/**
	 * @ignore
	 */
	public abstract makeColumn(dataItem: DataItem<this["_dataItemSettings"]>, listTemplate: ListTemplate<Graphics>): Graphics

	/**
	 * List of columns in series.
	 */
	public abstract columns: ListTemplate<Graphics>;

	protected _makeGraphics(listTemplate: ListTemplate<Graphics>, dataItem: DataItem<this["_dataItemSettings"]>): Graphics {
		return this.makeColumn(dataItem, listTemplate);
	}

	public _updateFields() {
		super._updateFields();

		let xAxis = this.get("xAxis");
		let yAxis = this.get("yAxis");

		if (xAxis.isType<CategoryAxis<any>>("CategoryAxis")) {
			if (!this.get("openCategoryXField")) {
				this._xOpenField = this._xField;
			}
		}

		if (xAxis.isType<DateAxis<any>>("ValueAxis")) {
			if (!this.get("openValueXField")) {
				this._xOpenField = this._xField;
			}
		}

		if (yAxis.isType<CategoryAxis<any>>("CategoryAxis")) {
			if (!this.get("openCategoryYField")) {
				this._yOpenField = this._yField;
			}
		}

		if (yAxis.isType<DateAxis<any>>("ValueAxis")) {
			if (!this.get("openValueYField")) {
				this._yOpenField = this._yField;
			}
		}
	}

	public _updateChildren() {
		let xAxis = this.get("xAxis");
		let yAxis = this.get("yAxis");
		let baseAxis = this.get("baseAxis")!;

		if (this.isDirty("fill")) {
			this.columns.template.set("fill", this.get("fill"));
		}

		if (this.isDirty("stroke")) {
			this.columns.template.set("stroke", this.get("stroke"));
		}

		let index = 0;
		let clusterCount = 0;
		let i = 0;
		$array.each(baseAxis.series, (series) => {
			if (series instanceof BaseColumnSeries) {
				const stacked = series.get("stacked");

				if (stacked && i == 0) {
					clusterCount++;
				}

				if (!stacked && series.get("clustered")) {
					clusterCount++;
				}
			}

			if (series === this) {
				index = clusterCount - 1;
			}
			i++;
		})

		if (!this.get("clustered")) {
			index = 0;
			clusterCount = 1;
		}

		if (clusterCount === 0) {
			clusterCount = 1;
			index = 0;
		}

		const xRenderer = xAxis.get("renderer");
		const yRenderer = yAxis.get("renderer");

		const cellLocationX0 = xRenderer.get("cellStartLocation", 0);
		const cellLocationX1 = xRenderer.get("cellEndLocation", 1);

		const cellLocationY0 = yRenderer.get("cellStartLocation", 0);
		const cellLocationY1 = yRenderer.get("cellEndLocation", 1);

		this._aLocationX0 = cellLocationX0 + (index / clusterCount) * (cellLocationX1 - cellLocationX0);
		this._aLocationX1 = cellLocationX0 + (index + 1) / clusterCount * (cellLocationX1 - cellLocationX0);;

		this._aLocationY0 = cellLocationY0 + (index / clusterCount) * (cellLocationY1 - cellLocationY0);
		this._aLocationY1 = cellLocationY0 + (index + 1) / clusterCount * (cellLocationY1 - cellLocationY0);

		if (xAxis.inited && yAxis.inited) {
			if (this._axesDirty || this._valuesDirty || this._stackDirty || this.isDirty("vcx") || this.isDirty("vcy") || this._sizeDirty) {
				this.axisRanges.each((axisRange) => {
					axisRange.columns.each((column) => {
						column.setPrivate("visible", false);
					})
				})

				const len = this.dataItems.length;

				let startIndex = Math.max(0, this.getPrivate("startIndex", 0) - 1);

				let endIndex = Math.min(this.getPrivate("endIndex", len) + 1, len);

				for (let i = 0; i < startIndex - 1; i++) {
					let di = this.dataItems[i];
					if (di) {
						let graphics = di.get("graphics");
						if (graphics) {
							graphics.setPrivate("visible", false);
						}
					}
				}

				let previous = this.dataItems[startIndex];

				for (let i = startIndex - 1; i <= endIndex; i++) {
					let di = this.dataItems[i];
					if (di) {
						this._updateGraphics(di, previous);
						previous = this.dataItems[i];
					}
				}

				for (let i = endIndex + 1; i < len; i++) {
					let di = this.dataItems[i];
					if (di) {
						let graphics = di.get("graphics");
						if (graphics) {
							graphics.setPrivate("visible", false);
						}
					}
				}
			}
		}
		else {
			this._skipped = true;
		}

		super._updateChildren();
	}

	protected _updateGraphics(dataItem: DataItem<this["_dataItemSettings"]>, previousDataItem: DataItem<this["_dataItemSettings"]>) {
		let graphics = dataItem.get("graphics");

		if (!graphics) {
			graphics = this._makeGraphics(this.columns, dataItem);
			dataItem.set("graphics", graphics);
			graphics._setDataItem(dataItem);

			const legendDataItem = dataItem.get("legendDataItem");
			if (legendDataItem) {
				const markerRectangle = legendDataItem.get("markerRectangle");
				if (markerRectangle) {
					markerRectangle.setAll({ fill: graphics.get("fill"), stroke: graphics.get("stroke") });
				}
			}

			this.axisRanges.each((axisRange) => {
				const container = axisRange.container!;
				const graphicsArray: Array<Graphics> = dataItem.get("rangeGraphics", []);
				dataItem.set("rangeGraphics", graphicsArray);

				const rangeGraphics = this._makeGraphics(axisRange.columns, dataItem);
				graphicsArray.push(rangeGraphics);
				container.children.push(rangeGraphics);
			})
		}

		const xField = this._xField;
		const yField = this._yField;

		const xOpenField = this._xOpenField;
		const yOpenField = this._yOpenField;

		let valueX = dataItem.get(xField as any);
		let valueY = dataItem.get(yField as any);

		let locationX = this.get("locationX", dataItem.get("locationX", 0.5));
		let locationY = this.get("locationY", dataItem.get("locationY", 0.5));

		let openLocationX = this.get("openLocationX", dataItem.get("openLocationX", locationX));
		let openLocationY = this.get("openLocationY", dataItem.get("openLocationY", locationY));

		let width = graphics.get("width");
		let height = graphics.get("height");

		const stacked = this.get("stacked");

		if (valueX != null && valueY != null) {
			const xAxis = this.get("xAxis");
			const yAxis = this.get("yAxis");
			const baseAxis = this.get("baseAxis");

			const xStart = xAxis.get("start");
			const xEnd = xAxis.get("end");

			const yStart = yAxis.get("start");
			const yEnd = yAxis.get("end");

			let l!: number;
			let r!: number;
			let t!: number;
			let b!: number;

			let vcy = this.get("vcy", 1);
			let vcx = this.get("vcx", 1);

			if (xAxis.isType<CategoryAxis<any>>("CategoryAxis") && yAxis.isType<CategoryAxis<any>>("CategoryAxis")) {

				let startLocation = this._aLocationX0 + openLocationX - 0.5;
				let endLocation = this._aLocationX1 + locationX - 0.5;

				if (width instanceof Percent) {
					let offset: number = (endLocation - startLocation) * (1 - width.value) / 2;
					startLocation += offset;
					endLocation -= offset;
				}

				l = xAxis.getDataItemPositionX(dataItem, xOpenField, startLocation, vcx);
				r = xAxis.getDataItemPositionX(dataItem, xField, endLocation, vcx);

				startLocation = this._aLocationY0 + openLocationY - 0.5;
				endLocation = this._aLocationY1 + locationY - 0.5;

				if (height instanceof Percent) {
					let offset: number = (endLocation - startLocation) * (1 - height.value) / 2;
					startLocation += offset;
					endLocation -= offset;
				}

				t = yAxis.getDataItemPositionY(dataItem, yOpenField, startLocation, vcy);
				b = yAxis.getDataItemPositionY(dataItem, yField, endLocation, vcy);

				dataItem.set("point", { x: l + (r - l) / 2, y: t + (b - t) / 2 });
			}
			else if (xAxis === baseAxis) {

				let startLocation = this._aLocationX0 + openLocationX - 0.5;
				let endLocation = this._aLocationX1 + locationX - 0.5;

				if (width instanceof Percent) {
					let offset: number = (endLocation - startLocation) * (1 - width.value) / 2;
					startLocation += offset;
					endLocation -= offset;
				}

				l = xAxis.getDataItemPositionX(dataItem, xOpenField, startLocation, vcx);
				r = xAxis.getDataItemPositionX(dataItem, xField, endLocation, vcx);
				t = yAxis.getDataItemPositionY(dataItem, yField, locationY, vcy);

				if (this._yOpenField != this._yField) {
					b = yAxis.getDataItemPositionY(dataItem, yOpenField, openLocationY, vcy);
				}
				else {
					if (stacked) {
						let stackToItemY = dataItem.get("stackToItemY")!;
						if (stackToItemY) {
							b = yAxis.getDataItemPositionY(stackToItemY, yField, openLocationY, (stackToItemY.component as XYSeries).get("vcy"));
						}
						else {
							b = yAxis.basePosition();
						}
					}
					else {
						b = yAxis.basePosition();
					}
				}

				dataItem.set("point", { x: l + (r - l) / 2, y: t });
			}
			else if (yAxis === baseAxis) {
				let startLocation = this._aLocationY0 + openLocationY - 0.5;
				let endLocation = this._aLocationY1 + locationY - 0.5;

				if (height instanceof Percent) {
					let offset: number = (endLocation - startLocation) * (1 - height.value) / 2;
					startLocation += offset;
					endLocation -= offset;
				}

				t = yAxis.getDataItemPositionY(dataItem, yOpenField, startLocation, vcy);
				b = yAxis.getDataItemPositionY(dataItem, yField, endLocation, vcy);
				r = xAxis.getDataItemPositionX(dataItem, xField, locationX, vcx);

				if (this._xOpenField != this._xField) {
					l = xAxis.getDataItemPositionX(dataItem, xOpenField, openLocationX, vcx);
				}
				else {
					if (stacked) {
						let stackToItemX = dataItem.get("stackToItemX")!;
						if (stackToItemX) {
							l = xAxis.getDataItemPositionX(stackToItemX, xField, openLocationX, (stackToItemX.component as XYSeries).get("vcx"));
						}
						else {
							l = xAxis.basePosition();
						}
					}
					else {
						l = xAxis.basePosition();
					}
				}

				dataItem.set("point", { x: r, y: t + (b - t) / 2 });
			}

			if ((l < xStart && r < xStart) || (l > xEnd && r > xEnd) || (t < yStart && b < yStart) || (t > yEnd && b > yEnd)) {
				graphics.setPrivate("visible", false);
			}

			this._updateSeriesGraphics(dataItem, graphics!, l, r, t, b);

			let rangeGraphics = dataItem.get("rangeGraphics")!;
			if (rangeGraphics) {
				$array.each(rangeGraphics, (graphics) => {
					this._updateSeriesGraphics(dataItem, graphics, l, r, t, b);
				})
			}

			this._applyGraphicsStates(dataItem, previousDataItem);
		}
	}

	protected _updateSeriesGraphics(dataItem: DataItem<this["_dataItemSettings"]>, graphics: Graphics, l: number, r: number, t: number, b: number) {

		let width = graphics.get("width");
		let height = graphics.get("height");
		let maxWidth = graphics.get("maxWidth");
		let maxHeight = graphics.get("maxHeight");

		graphics.setPrivate("visible", true);

		const ptl = this.getPoint(l, t);
		const pbr = this.getPoint(r, b);

		l = ptl.x;
		r = pbr.x;

		t = ptl.y;
		b = pbr.y;

		//if (t > b) {
		//	[t, b] = [b, t];
		//}
		//if (l > r) {
		//	[l, r] = [r, l];
		//}

		if ($type.isNumber(width)) {
			let offset: number = ((r - l) - width) / 2;
			l += offset;
			r -= offset;
		}

		if ($type.isNumber(maxWidth) && maxWidth < Math.abs(r - l)) {
			let offset: number = ((r - l) - maxWidth) / 2;
			l += offset;
			r -= offset;
		}

		if ($type.isNumber(height)) {
			let offset: number = ((b - t) - height) / 2;
			t += offset;
			b -= offset;
		}

		if ($type.isNumber(maxHeight) && maxHeight < Math.abs(b - t)) {
			let offset: number = ((b - t) - maxHeight) / 2;
			t += offset;
			b -= offset;
		}

		graphics.setPrivate("width", r - l);
		graphics.setPrivate("height", b - t);
		graphics.set("x", l);
		graphics.set("y", b - (b - t));

		dataItem.set("left", l);
		dataItem.set("right", r);
		dataItem.set("top", t);
		dataItem.set("bottom", b);
	}

	protected _handleDataSetChange() {
		super._handleDataSetChange();
		$array.each(this._dataItems, (dataItem) => {
			const graphics = dataItem.get("graphics");
			if (graphics) {
				graphics.setPrivate("visible", false);
			}
		})
	}

	protected _applyGraphicsStates(dataItem: DataItem<this["_dataItemSettings"]>, previousDataItem: DataItem<this["_dataItemSettings"]>) {

		let graphics = dataItem.get("graphics")!;

		const dropFromOpen = graphics.states.lookup("dropFromOpen");
		const riseFromOpen = graphics.states.lookup("riseFromOpen");

		const dropFromPrevious = graphics.states.lookup("dropFromPrevious");
		const riseFromPrevious = graphics.states.lookup("riseFromPrevious");

		if (dropFromOpen || dropFromPrevious || riseFromOpen || riseFromPrevious) {
			let xAxis = this.get("xAxis");
			let yAxis = this.get("yAxis");
			let baseAxis = this.get("baseAxis");

			let open: number | undefined;
			let close: number | undefined;
			let previousClose: number | undefined;

			if (baseAxis === xAxis && yAxis.isType<ValueAxis<any>>("ValueAxis")) {
				open = dataItem.get(this._yOpenField as any);
				close = dataItem.get(this._yField as any);

				previousClose = previousDataItem.get(this._yField as any);
			}
			else if (baseAxis === yAxis && xAxis.isType<ValueAxis<any>>("ValueAxis")) {
				open = dataItem.get(this._xOpenField as any);
				close = dataItem.get(this._xField as any);

				previousClose = previousDataItem.get(this._xField as any);
			}

			if ($type.isNumber(open) && $type.isNumber(close)) {
				if (close < open) {
					if (dropFromOpen) {
						dropFromOpen.apply();
					}
				}
				else {
					if (riseFromOpen) {
						riseFromOpen.apply();
					}
				}
				if ($type.isNumber(previousClose)) {
					if (close < previousClose) {
						if (dropFromPrevious) {
							dropFromPrevious.apply();
						}
					}
					else {
						if (riseFromPrevious) {
							riseFromPrevious.apply();
						}
					}
				}
			}
		}
	}

	/**
	 * @ignore
	 */
	public disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>) {
		super.disposeDataItem(dataItem);
		const graphics = dataItem.get("graphics");
		if (graphics) {
			graphics.dispose();
		}

		const rangeGraphics = dataItem.get("rangeGraphics")!;
		if (rangeGraphics) {
			$array.each(rangeGraphics, (graphics) => {
				graphics.dispose();
			})
		}
	}

	/**
	 * Hides series's data item.
	 * 
	 * @param   dataItem  Data item
	 * @param   duration  Animation duration in milliseconds
	 * @return            Promise
	 */
	public async hideDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void> {
		const promises = [super.hideDataItem(dataItem, duration)];
		const graphics = dataItem.get("graphics");
		if (graphics) {
			promises.push(graphics.hide(duration));
		}
		await Promise.all(promises);
	}

	/**
	 * Shows series's data item.
	 * 
	 * @param   dataItem  Data item
	 * @param   duration  Animation duration in milliseconds
	 * @return            Promise
	 */
	public async showDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void> {
		const promises = [super.showDataItem(dataItem, duration)];
		const graphics = dataItem.get("graphics");
		if (graphics) {
			promises.push(graphics.show(duration));
		}
		await Promise.all(promises);
	}

	/**
	 * @ignore
	 */
	public updateLegendMarker(dataItem?: DataItem<IBaseColumnSeriesDataItem>) {
		const legendDataItem = this.get("legendDataItem");

		if (legendDataItem) {

			let graphics: Template<Graphics> | Graphics = this.columns.template;
			if (dataItem) {
				let column = dataItem.get("graphics");
				if (column) {
					graphics = column;
				}
			}

			const markerRectangle = legendDataItem.get("markerRectangle");

			if (markerRectangle) {
				if (!legendDataItem.get("itemContainer").get("disabled")) {
					markerRectangle.setAll({ fill: graphics.get("fill", this.get("fill")), fillOpacity: graphics.get("fillOpacity"), fillGradient: graphics.get("fillGradient"), stroke: graphics.get("stroke", this.get("stroke")), strokeOpacity: graphics.get("strokeOpacity"), strokeGradient: graphics.get("strokeGradient"), strokeDasharray: graphics.get("strokeDasharray"), fillPattern: graphics.get("fillPattern") });
				}
			}
		}
	}

	protected _getTooltipTarget(dataItem: DataItem<this["_dataItemSettings"]>): Sprite {
		let column = dataItem.get("graphics");
		if (column) {
			return column
		}
		return this;
	}
}