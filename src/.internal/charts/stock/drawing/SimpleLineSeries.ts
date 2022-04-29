import type { ISpritePointerEvent } from "../../../core/render/Sprite";
import type { DataItem } from "../../../core/render/Component";
import type { IPoint } from "../../../core/util/IPoint";

import { DrawingSeries, IDrawingSeriesSettings, IDrawingSeriesPrivate, IDrawingSeriesDataItem } from "./DrawingSeries";
import { Line } from "../../../core/render/Line";
import { ListTemplate } from "../../../core/util/List";
import { Template } from "../../../core/util/Template";

import * as $math from "../../../core/util/Math";

export interface ISimpleLineSeriesDataItem extends IDrawingSeriesDataItem {

}

export interface ISimpleLineSeriesSettings extends IDrawingSeriesSettings {
	/**
	 * @todo review
	 */	
	showExtension?: boolean;
}

export interface ISimpleLineSeriesPrivate extends IDrawingSeriesPrivate {

}

export class SimpleLineSeries extends DrawingSeries {
	public static className: string = "SimpleLineSeries";
	public static classNames: Array<string> = DrawingSeries.classNames.concat([SimpleLineSeries.className]);

	declare public _settings: ISimpleLineSeriesSettings;
	declare public _privateSettings: ISimpleLineSeriesPrivate;
	declare public _dataItemSettings: ISimpleLineSeriesDataItem;

	protected _tag = "line";

	/**
	 * @ignore
	 */
	public makeLine(): Line {
		const line = this.lines.make();
		this.mainContainer.children.push(line);
		this.lines.push(line);
		return line;
	}

	public readonly lines: ListTemplate<Line> = new ListTemplate(
		Template.new({}),
		() => Line._new(this._root, {}, [this.lines.template])
	);

	/**
	 * @ignore
	 */
	public makeHitLine(): Line {
		const line = this.hitLines.make();
		line.addTag("hit");
		this.mainContainer.children.push(line);
		this.hitLines.push(line);
		return line;
	}



	public readonly hitLines: ListTemplate<Line> = new ListTemplate(
		Template.new({}),
		() => Line._new(this._root, {}, [this.hitLines.template])
	);

	protected _di: Array<{ [index: string]: DataItem<ISimpleLineSeriesDataItem> }> = [];
	protected _lines: Array<Line> = [];
	protected _hitLines: Array<Line> = [];

	protected _afterNew() {
		super._afterNew();
		const lineTemplate = this.lines.template;
		lineTemplate.events.on("pointerover", (e) => {
			this._showSegmentBullets(e.target.get("userData"));
		})

		lineTemplate.events.on("pointerout", (e) => {
			this._hideAllBullets();

			const index = e.target.get("userData");

			const line = this._lines[index];
			if (line) {
				line.unhover();
			}

			const strokeIndex = this._getStrokeIndex(index);
			const stroke = this.strokes.getIndex(strokeIndex);
			if (stroke) {
				stroke.unhover();
			}
		})

		const hitTemplate = this.hitLines.template;
		hitTemplate.events.on("pointerover", (e) => {
			const index = e.target.get("userData");
			this._showSegmentBullets(index);

			const line = this._lines[index];

			if (line) {
				line.hover();
			}

			const strokeIndex = this._getStrokeIndex(index);
			const stroke = this.strokes.getIndex(strokeIndex);
			if (stroke) {
				stroke.hover();
			}
		})

		hitTemplate.events.on("click", (e) => {
			if (this._erasingEnabled) {
				this._disposeIndex(e.target.get("userData"));
			}
		})

		hitTemplate.events.on("dragstart", (e) => {
			const index = e.target.get("userData");
			const line = this._lines[index];

			if (line) {
				line.dragStart(e);
			}

			const strokeIndex = this._getStrokeIndex(index);
			const stroke = this.strokes.getIndex(strokeIndex);

			if (stroke) {
				stroke.dragStart(e);
			}
		})

		hitTemplate.events.on("dragstop", (e) => {
			const index = e.target.get("userData");

			this.markDirtyValues();
			e.target.setAll({ x: 0, y: 0 });
			const line = this._lines[index];

			if (line) {
				line.dragStop(e);
				line.setAll({ x: 0, y: 0 });
			}

			const strokeIndex = this._getStrokeIndex(index);
			const stroke = this.strokes.getIndex(strokeIndex);
			if (stroke) {
				stroke.dragStop(e);
				stroke.setAll({ x: 0, y: 0 });
			}
		})

		hitTemplate.events.on("pointerout", (e) => {
			const index = e.target.get("userData");
			this._hideAllBullets();

			const line = this._lines[index];

			if (line) {
				line.unhover();
			}

			const strokeIndex = this._getStrokeIndex(index);
			const stroke = this.strokes.getIndex(strokeIndex);
			if (stroke) {
				stroke.unhover();
			}
		})
	}


	protected _updateElements() {
		const chart = this.chart;
		if (chart) {
			const s = Math.max(chart.plotContainer.width(), chart.plotContainer.height()) * 2;
			for (let i = 0; i < this._lines.length; i++) {
				const line = this._lines[i];
				if (line) {
					const hitLine = this._hitLines[i];
					const diP1 = this._di[i]["p1"];
					const diP2 = this._di[i]["p2"];

					const p1 = diP1.get("point");
					const p2 = diP2.get("point");

					if (p1 && p2) {
						const len = Math.max(Math.abs(s - p1.x), Math.abs(s - p2.x), Math.abs(s - p1.y), Math.abs(s - p2.y), Math.abs(p1.x), Math.abs(p2.x), Math.abs(p1.y), Math.abs(p2.y))
						let angle = $math.getAngle(p2, p1);

						const p11 = { x: p1.x + len * $math.cos(angle), y: p1.y + len * $math.sin(angle) };
						const p22 = { x: p2.x - len * $math.cos(angle), y: p2.y - len * $math.sin(angle) };
						this._updateLine(line, hitLine, p11, p22, p1, p2);
					}
				}
			}
		}
	}

	protected _updateLine(line: Line, hitLine: Line, p11: IPoint, p22: IPoint, p1: IPoint, p2: IPoint) {
		let segments = [[[p11, p1]], [[p2, p22]]];
		line.set("segments", segments);
		hitLine.set("segments", segments);
	}

	protected _handlePointerClickReal(event: ISpritePointerEvent) {
		if (!this._isDragging) {
			if (!this._isDrawing) {
				this._isDrawing = true;
				this._addPoints(event, this._index);
			}
			else {
				this._isDrawing = false;
				this._index++;
			}
		}
	}

	protected _handlePointerClick(event: ISpritePointerEvent) {
		super._handlePointerClick(event);
		this._handlePointerClickReal(event);
	}

	protected _handlePointerMove(event: ISpritePointerEvent) {
		super._handlePointerMove(event);
		this._handlePointerMoveReal(event);
	}


	protected _handlePointerMoveReal(_event: ISpritePointerEvent) {
		if (this._isDrawing) {
			const movePoint = this._movePointerPoint;

			if (movePoint) {

				const xAxis = this.get("xAxis");
				const yAxis = this.get("yAxis");

				const valueX = this._getXValue(xAxis.positionToValue(xAxis.coordinateToPosition(movePoint.x)));
				const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(movePoint.y)));

				const index = this._index;
				const diP1 = this._di[index]["p1"];
				const diP2 = this._di[index]["p2"];

				if (diP1 && diP2) {
					diP2.set("valueX", valueX);
					diP2.set("valueY", valueY);
					diP2.set("valueYWorking", valueY);

					this._setXLocation(diP2, valueX);
				}

				this._updateSegment(index);
			}
		}
	}

	protected _addPoints(event: ISpritePointerEvent, index: number): Line {
		const chart = this.chart!;

		const xAxis = this.get("xAxis");
		const yAxis = this.get("yAxis");

		const point = chart.plotContainer.toLocal(event.point);
		const valueX = xAxis.positionToValue(xAxis.coordinateToPosition(point.x));
		const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(point.y)));

		this._di[index] = {};
		const line = this.makeLine();
		this._lines[index] = line;

		const hitLine = this.makeHitLine();
		this._hitLines[index] = hitLine;

		line.setPrivate("visible", this.get("showExtension", true));

		const stroke = this.get("strokeColor", this.get("stroke"));
		const settings = { stroke: stroke, userData: index };
		line.setAll(settings);
		hitLine.setAll(settings);

		this.data.push({ stroke: this._getStrokeTemplate() });
		this._addContextInfo(index, "e");

		this._addPoint(valueX, valueY, "p1", index);
		this._addPoint(valueX, valueY, "p2", index);

		return line;
	}

	protected _addPoint(valueX: number, valueY: number, corner: string, index: number) {
		this.data.push({ valueY: valueY, valueX: valueX });
		const len = this.dataItems.length;
		const dataItem = this.dataItems[len - 1];
		if (dataItem) {
			this._addContextInfo(index, corner);
			this._di[index][corner] = dataItem;

			this.setPrivate("startIndex", 0);
			this.setPrivate("endIndex", len);

			this._setXLocation(dataItem, valueX);
		}
	}

	public disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>) {
		super.disposeDataItem(dataItem);
		const dataContext = dataItem.dataContext as any;
		if (dataContext) {

			const index = dataContext.index;
			const line = this._lines[index];
			if (line) {
				this.lines.removeValue(line);
				delete (this._lines[index]);
				line.dispose();
			}
			const hitLine = this._hitLines[index];
			if (hitLine) {
				this.hitLines.removeValue(hitLine);
				delete (this._hitLines[index]);
				hitLine.dispose();
			}
		}
	}

	protected _updateExtentionLine(line: Line) {
		let strokeOpacity = this.get("strokeOpacity");
		if (strokeOpacity != null) {
			line.set("strokeOpacity", strokeOpacity);
		}

		let strokeWidth = this.get("strokeWidth");
		if (strokeWidth != null) {
			line.set("strokeWidth", strokeWidth);
		}

		let strokeDasharray = this.get("strokeDasharray");
		if (strokeDasharray != null) {
			line.set("strokeDasharray", strokeDasharray);
		}
	}
}