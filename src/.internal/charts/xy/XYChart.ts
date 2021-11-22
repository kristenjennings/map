import type { Axis } from "./axes/Axis";
import type { XYCursor } from "./XYCursor";
import type { AxisRenderer } from "./axes/AxisRenderer";
import type { DataItem } from "../../core/render/Component";
import type { IDisposer } from "../../core/util/Disposer";
import type { XYSeries, IXYSeriesDataItem } from "./series/XYSeries";
import type { IPointerEvent } from "../../core/render/backend/Renderer";
import type { Scrollbar } from "../../core/render/Scrollbar";
import type { Tooltip } from "../../core/render/Tooltip";
import type { IPoint } from "../../core/util/IPoint";

import { XYChartDefaultTheme } from "./XYChartDefaultTheme";
import { Container } from "../../core/render/Container";
import { Rectangle } from "../../core/render/Rectangle";
import { SerialChart, ISerialChartPrivate, ISerialChartSettings, ISerialChartEvents } from "../../core/render/SerialChart";
import { ListAutoDispose } from "../../core/util/List";
import { p100 } from "../../core/util/Percent";
import { Color } from "../../core/util/Color";
import { Button } from "../../core/render/Button";
import { Graphics } from "../../core/render/Graphics";
import { Percent } from "../../core/util/Percent";

import * as $array from "../../core/util/Array";
import * as $order from "../../core/util/Order";
import * as $type from "../../core/util/Type";
import type { Animation } from "../../core/util/Entity";

export interface IXYChartSettings extends ISerialChartSettings {

	/**
	 * horizontal scrollbar.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/} for more info
	 */
	scrollbarX?: Scrollbar;

	/**
	 * Vertical scrollbar.
	 *
	 */
	scrollbarY?: Scrollbar;

	/**
	 * If this is set to `true`, users will be able to pan the chart horizontally
	 * by dragging plot area.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Panning} for more info
	 */
	panX?: boolean;

	/**
	 * If this is set to `true`, users will be able to pan the chart vertically
	 * by dragging plot area.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Panning} for more info
	 */
	panY?: boolean;

	/**
	 * Indicates what happens when mouse wheel is spinned horizontally while over
	 * plot area.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Mouse_wheel_behavior} for more info
	 */
	wheelX?: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none";

	/**
	 * Indicates what happens when mouse wheel is spinned vertically while over
	 * plot area.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Mouse_wheel_behavior} for more info
	 */
	wheelY?: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none";

	/**
	 * Indicates the relative "speed" of the mouse wheel.
	 *
	 * @default 0.25
	 */
	wheelStep?: number;

	/**
	 * Chart's cursor.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/} for more info
	 */
	cursor?: XYCursor;

	/**
	 * Indicates maximum distance from pointer (moust or touch) to points
	 * tooltips need to be shown for.
	 *
	 * Points that are further from pointer than this setting will not be shown.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/#Tooltips} for more info
	 */
	maxTooltipDistance?: number;

	/**
	 * If set to `false` the chart will not check for overlapping of multiple
	 * tooltips, and will not arrange them to not overlap.
	 *
	 * Will work only if chart has an `XYCursor` enabled.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/#Tooltips} for more info
	 * @default true
	 */
	arrangeTooltips?: boolean

}

export interface IXYChartPrivate extends ISerialChartPrivate {
}


export interface IXYChartEvents extends ISerialChartEvents {

	/**
	 * Invoked when panning starts.
	 *
	 * @since 5.0.4
	 */
	panstarted: {};

	/**
	 * Invoked when panning ends.
	 * 
	 * @since 5.0.4
	 */
	panended: {};

	/**
	 * Invoked when wheel caused zoom ends.
	 * 
	 * @since 5.0.4
	 */
	wheelended: {};

}

/**
 * Creates an XY chart.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/} for more info
 * @important
 */
export class XYChart extends SerialChart {

	public static className: string = "XYChart";
	public static classNames: Array<string> = SerialChart.classNames.concat([XYChart.className]);

	declare public _settings: IXYChartSettings;
	declare public _privateSettings: IXYChartPrivate;
	declare public _seriesType: XYSeries;
	declare public _events: IXYChartEvents;

	/**
	 * A list of horizontal axes.
	 */
	public readonly xAxes: ListAutoDispose<Axis<AxisRenderer>> = new ListAutoDispose();

	/**
	 * A list of vertical axes.
	 */
	public readonly yAxes: ListAutoDispose<Axis<AxisRenderer>> = new ListAutoDispose();

	/**
	 * A [[Container]] located on top of the chart, used to store top horizontal
	 * axes.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
	 * @default Container.new()
	 */
	public readonly topAxesContainer: Container = this.chartContainer.children.push(Container.new(this._root, { width: p100, layout: this._root.verticalLayout }));

	/**
	 * A [[Container]] located in the middle the chart, used to store vertical axes
	 * and plot area container.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
	 * @default Container.new()
	 */
	public readonly yAxesAndPlotContainer: Container = this.chartContainer.children.push(Container.new(this._root, { width: p100, height: p100, layout: this._root.horizontalLayout }));

	/**
	 * A [[Container]] located on bottom of the chart, used to store bottom
	 * horizontal axes.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
	 * @default Container.new()
	 */
	public readonly bottomAxesContainer: Container = this.chartContainer.children.push(Container.new(this._root, { width: p100, layout: this._root.verticalLayout }));

	/**
	 * A [[Container]] located on left of the chart, used to store left-hand
	 * vertical axes.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
	 * @default Container.new()
	 */
	public readonly leftAxesContainer: Container = this.yAxesAndPlotContainer.children.push(Container.new(this._root, { height: p100, layout: this._root.horizontalLayout }));

	/**
	 * A [[Container]] located in the middle of the chart, used to store actual
	 * plots (series).
	 *
	 * NOTE: `plotContainer` will automatically have its `background` preset. If
	 * you need to modify background or outline for chart's plot area, you can
	 * use `plotContainer.get("background")` for that.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
	 * @default Container.new()
	 */
	public readonly plotContainer: Container = this.yAxesAndPlotContainer.children.push(Container.new(this._root, { width: p100, height: p100, maskContent: false }));

	/**
	 * A [[Container]] axis grid elements are stored in.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
	 * @default Container.new()
	 */
	public readonly gridContainer: Container = this.plotContainer.children.push(Container.new(this._root, { width: p100, height: p100, isMeasured: false }));

	/**
	 * A [[Container]] axis background grid elements are stored in.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
	 * @default Container.new()
	 */
	public readonly topGridContainer: Container = Container.new(this._root, { width: p100, height: p100, isMeasured: false });

	/**
	 * A [[Container]] located on right of the chart, used to store right-hand
	 * vertical axes.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
	 * @default Container.new()
	 */
	public readonly rightAxesContainer: Container = this.yAxesAndPlotContainer.children.push(Container.new(this._root, { height: p100, layout: this._root.horizontalLayout }));

	/**
	 * A [[Container]] axis headers are stored in.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-headers/} for more info
	 * @default Container.new()
	 */
	public readonly axisHeadersContainer: Container = this.plotContainer.children.push(Container.new(this._root, {}));

	/**
	 * A button that is shown when chart is not fully zoomed out.
	 *
	 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Zoom_out_button} for more info
	 * @default Button.new()
	 */
	public readonly zoomOutButton: Button = this.plotContainer.children.push(Button.new(this._root, {
		themeTags: ["zoom"],
		icon: Graphics.new(this._root, {
			themeTags: ["button", "icon"]
		})
	}));

	public _movePoint: IPoint = { x: 0, y: 0 };

	protected _wheelDp: IDisposer | undefined;

	public _otherCharts?: Array<XYChart>;

	protected _afterNew() {
		this._defaultThemes.push(XYChartDefaultTheme.new(this._root));

		super._afterNew();

		this._disposers.push(this.xAxes);
		this._disposers.push(this.yAxes);

		const root = this._root;

		let verticalLayout = this._root.verticalLayout;

		const zoomOutButton = this.zoomOutButton;
		zoomOutButton.events.on("click", () => {
			this.zoomOut();
		})
		zoomOutButton.set("opacity", 0);
		zoomOutButton.states.lookup("default")!.set("opacity", 1);

		this.chartContainer.set("layout", verticalLayout);

		const plotContainer = this.plotContainer;
		plotContainer.children.push(this.seriesContainer);

		this._disposers.push(this._processAxis(this.xAxes, this.bottomAxesContainer));
		this._disposers.push(this._processAxis(this.yAxes, this.leftAxesContainer));


		plotContainer.children.push(this.topGridContainer);
		plotContainer.children.push(this.bulletsContainer);

		plotContainer.children.moveValue(zoomOutButton);

		// Setting trasnparent background so that full body of the plot container
		// is interactive
		plotContainer.set("interactive", true);
		plotContainer.set("interactiveChildren", false);
		plotContainer.set("background", Rectangle.new(root, {
			themeTags: ["xy", "background"],
			fill: Color.fromHex(0x000000),
			fillOpacity: 0
		}));

		this._disposers.push(plotContainer.events.on("pointerdown", (event) => {
			this._handlePlotDown(event.originalEvent);
		}));

		this._disposers.push(plotContainer.events.on("globalpointerup", (event) => {
			this._handlePlotUp(event.originalEvent);
		}));

		this._disposers.push(plotContainer.events.on("globalpointermove", (event) => {
			this._handlePlotMove(event.originalEvent);
		}));
	}

	protected _removeSeries(series: this["_seriesType"]) {
		const xAxis = series.get("xAxis");
		if (xAxis) {
			$array.remove(xAxis.series, series);
		}
		const yAxis = series.get("yAxis");
		if (yAxis) {
			$array.remove(yAxis.series, series);
		}
		super._removeSeries(series);
	}

	protected _handleSetWheel() {
		const wheelX = this.get("wheelX");
		const wheelY = this.get("wheelY");
		const plotContainer = this.plotContainer;

		if (wheelX !== "none" || wheelY !== "none") {
			plotContainer.set("wheelable", true);
			this._wheelDp = plotContainer.events.on("wheel", (event) => {
				const wheelEvent = event.originalEvent;

				const plotPoint = plotContainer.toLocal(this._root.documentPointToRoot({ x: wheelEvent.clientX, y: wheelEvent.clientY }))
				const wheelStep = this.get("wheelStep", 0.2);

				const shiftY = wheelEvent.deltaY / 100;
				const shiftX = wheelEvent.deltaX / 100;

				if ((wheelX === "zoomX" || wheelX === "zoomXY") && shiftX != 0) {
					this.xAxes.each((axis) => {
						if (axis.get("zoomX")) {
							let start = axis.get("start")!;
							let end = axis.get("end")!;

							let position = axis.fixPosition(plotPoint.x / plotContainer.width());

							let newStart = start - wheelStep * (end - start) * shiftX * position;
							let newEnd = end + wheelStep * (end - start) * shiftX * (1 - position);
							if (1 / (newEnd - newStart) < axis.get("maxZoomFactor", Infinity)) {
								this._handleWheelAnimation(axis.zoom(newStart, newEnd));
							}
						}
					})
				}

				if ((wheelY === "zoomX" || wheelY === "zoomXY") && shiftY != 0) {
					this.xAxes.each((axis) => {
						if (axis.get("zoomX")) {
							let start = axis.get("start")!;
							let end = axis.get("end")!;


							let position = axis.fixPosition(plotPoint.x / plotContainer.width());

							let newStart = start - wheelStep * (end - start) * shiftY * position;
							let newEnd = end + wheelStep * (end - start) * shiftY * (1 - position);
							if (1 / (newEnd - newStart) < axis.get("maxZoomFactor", Infinity)) {
								this._handleWheelAnimation(axis.zoom(newStart, newEnd));
							}
						}
					})
				}


				if ((wheelX === "zoomY" || wheelX === "zoomXY") && shiftX != 0) {
					this.yAxes.each((axis) => {
						if (axis.get("zoomY")) {
							let start = axis.get("start")!;
							let end = axis.get("end")!;

							let position = axis.fixPosition(plotPoint.y / plotContainer.height());

							let newStart = start - wheelStep * (end - start) * shiftX * position;
							let newEnd = end + wheelStep * (end - start) * shiftX * (1 - position);
							if (1 / (newEnd - newStart) < axis.get("maxZoomFactor", Infinity)) {
								this._handleWheelAnimation(axis.zoom(newStart, newEnd));
							}
						}
					})
				}

				if ((wheelY === "zoomY" || wheelY === "zoomXY") && shiftY != 0) {
					this.yAxes.each((axis) => {
						if (axis.get("zoomY")) {
							let start = axis.get("start")!;
							let end = axis.get("end")!;

							let position = axis.fixPosition(plotPoint.y / plotContainer.height());

							let newStart = start - wheelStep * (end - start) * shiftY * position;
							let newEnd = end + wheelStep * (end - start) * shiftY * (1 - position);

							if (1 / (newEnd - newStart) < axis.get("maxZoomFactor", Infinity)) {
								this._handleWheelAnimation(axis.zoom(newStart, newEnd));
							}
						}
					})
				}


				if ((wheelX === "panX" || wheelX === "panXY") && shiftX != 0) {
					this.xAxes.each((axis) => {
						if (axis.get("panX")) {
							let start = axis.get("start")!;
							let end = axis.get("end")!;

							let position = axis.fixPosition(plotPoint.x / plotContainer.width());

							let newStart = start + wheelStep * (end - start) * shiftX * position;
							let newEnd = end + wheelStep * (end - start) * shiftX * (1 - position);

							this._handleWheelAnimation(axis.zoom(newStart, newEnd));
						}
					})
				}

				if ((wheelY === "panX" || wheelY === "panXY") && shiftY != 0) {
					this.xAxes.each((axis) => {
						if (axis.get("panX")) {
							let start = axis.get("start")!;
							let end = axis.get("end")!;

							let position = axis.fixPosition(plotPoint.x / plotContainer.width());

							let newStart = start + wheelStep * (end - start) * shiftY * position;
							let newEnd = end + wheelStep * (end - start) * shiftY * (1 - position);

							this._handleWheelAnimation(axis.zoom(newStart, newEnd));
						}
					})
				}

				if ((wheelX === "panY" || wheelX === "panXY") && shiftX != 0) {
					this.yAxes.each((axis) => {
						if (axis.get("panY")) {
							let start = axis.get("start")!;
							let end = axis.get("end")!;

							let position = axis.fixPosition(plotPoint.y / plotContainer.height());

							let newStart = start + wheelStep * (end - start) * shiftX * position;
							let newEnd = end + wheelStep * (end - start) * shiftX * (1 - position);

							this._handleWheelAnimation(axis.zoom(newStart, newEnd));
						}
					})
				}

				if ((wheelY === "panY" || wheelY === "panXY") && shiftY != 0) {
					this.yAxes.each((axis) => {
						if (axis.get("panY")) {
							let start = axis.get("start")!;
							let end = axis.get("end")!;

							let position = axis.fixPosition(plotPoint.y / plotContainer.height());

							let newStart = start + wheelStep * (end - start) * shiftY * position;
							let newEnd = end + wheelStep * (end - start) * shiftY * (1 - position);

							this._handleWheelAnimation(axis.zoom(newStart, newEnd));
						}
					})
				}
			});

			this._disposers.push(this._wheelDp);
		}
		else {
			plotContainer.set("wheelable", false);
			if (this._wheelDp) {
				this._wheelDp.dispose();
			}
		}
	}

	protected _handlePlotDown(event: IPointerEvent) {

		// TODO: handle multitouch
		if (this.get("panX") || this.get("panY")) {
			const plotContainer = this.plotContainer;

			let local = plotContainer.toLocal(this._root.documentPointToRoot({ x: event.clientX, y: event.clientY }));

			if (local.x >= 0 && local.y >= 0 && local.x <= plotContainer.width() && local.y <= this.height()) {
				this._downPoint = local;

				const panX = this.get("panX");
				const panY = this.get("panY");

				if (panX) {
					this.xAxes.each((axis) => {
						axis._panStart = axis.get("start")!;
						axis._panEnd = axis.get("end")!;
					})
				}
				if (panY) {
					this.yAxes.each((axis) => {
						axis._panStart = axis.get("start")!;
						axis._panEnd = axis.get("end")!;
					})
				}

				const eventType = "panstarted";
				if (this.events.isEnabled(eventType)) {
					this.events.dispatch(eventType, { type: eventType, target: this });
				}
			}
		}
	}

	protected _handleWheelAnimation(animation?: Animation<any>) {
		if (animation) {
			animation.events.on("stopped", () => {
				this._dispatchWheelAnimation();
			})
		}
		else {
			this._dispatchWheelAnimation();
		}
	}

	protected _dispatchWheelAnimation() {
		const eventType = "wheelended";
		if (this.events.isEnabled(eventType)) {
			this.events.dispatch(eventType, { type: eventType, target: this });
		}
	}

	protected _handlePlotUp(_event: IPointerEvent) {

		if (this._downPoint) {
			if (this.get("panX") || this.get("panY")) {
				const eventType = "panended";
				if (this.events.isEnabled(eventType)) {
					this.events.dispatch(eventType, { type: eventType, target: this });
				}
			}
		}

		// TODO: handle multitouch
		this._downPoint = undefined;
		this.xAxes.each((xAxis) => {
			xAxis._isPanning = false;
		})
		this.yAxes.each((yAxis) => {
			yAxis._isPanning = false;
		})
	}

	protected _handlePlotMove(event: IPointerEvent) {
		// TODO: handle multitouch
		const downPoint = this._downPoint!;

		if (downPoint) {
			const plotContainer = this.plotContainer;

			let local = plotContainer.toLocal(this._root.documentPointToRoot({ x: event.clientX, y: event.clientY }));

			const panX = this.get("panX");
			const panY = this.get("panY");

			if (panX) {

				let scrollbarX = this.get("scrollbarX");
				if (scrollbarX) {
					scrollbarX.events.disableType("rangechanged");
				}

				this.xAxes.each((axis) => {
					if (axis.get("panX")) {
						axis._isPanning = true;
						//const maxDeviation = axis.get("maxDeviation", 0);
						let panStart = axis._panStart;
						let panEnd = axis._panEnd;
						let difference = (panEnd - panStart);
						let deltaX = difference * (downPoint.x - local.x) / plotContainer.width();

						if (axis.get("renderer").get("inversed")) {
							deltaX *= -1;
						}
						let start = panStart + deltaX;
						let end = panEnd + deltaX;

						if (end - start < 1 + axis.get("maxDeviation", 1) * 2) {
							axis.set("start", start);
							axis.set("end", end);
						}
					}
				})
				if (scrollbarX) {
					scrollbarX.events.enableType("rangechanged");
				}
			}
			if (panY) {

				let scrollbarY = this.get("scrollbarY");
				if (scrollbarY) {
					scrollbarY.events.disableType("rangechanged");
				}

				this.yAxes.each((axis) => {
					if (axis.get("panY")) {
						axis._isPanning = true;
						//const maxDeviation = axis.get("maxDeviation", 0);

						let panStart = axis._panStart;
						let panEnd = axis._panEnd;
						let difference = (panEnd - panStart);
						let deltaY = difference * (downPoint.y - local.y) / plotContainer.height();
						if (axis.get("renderer").get("inversed")) {
							deltaY *= -1;
						}
						let start = panStart - deltaY;
						let end = panEnd - deltaY;

						if (end - start < 1 + axis.get("maxDeviation", 1) * 2) {
							axis.set("start", start);
							axis.set("end", end);
						}
					}
				})

				if (scrollbarY) {
					scrollbarY.events.enableType("rangechanged");
				}
			}
		}
	}

	public _handleCursorPosition() {
		const cursor = this.get("cursor");
		if (cursor) {
			const cursorPoint = cursor.getPrivate("point");

			const snapToSeries = cursor.get("snapToSeries");
			if (snapToSeries && cursorPoint) {
				const dataItems: Array<DataItem<IXYSeriesDataItem>> = [];
				$array.each(snapToSeries, (series) => {
					if (!series.isHidden() && !series.isHiding()) {
						const startIndex = series.getPrivate("startIndex", 0);
						const endIndex = series.getPrivate("endIndex", series.dataItems.length - 1);
						for (let i = startIndex; i < endIndex; i++) {
							const dataItem = series.dataItems[i];
							if (dataItem && !dataItem.isHidden()) {
								dataItems.push(dataItem);
							}
						}
					}
				})

				let minDistance = Infinity;
				let closestItem: DataItem<IXYSeriesDataItem> | undefined;
				const snapToSeriesBy = cursor.get("snapToSeriesBy");
				$array.each(dataItems, (dataItem) => {
					const point = dataItem.get("point");

					if (point) {
						let distance = 0;
						if (snapToSeriesBy == "x") {
							distance = Math.abs(cursorPoint.x - point.x);
						}
						else if (snapToSeriesBy == "y") {
							distance = Math.abs(cursorPoint.y - point.y);
						}
						else {
							distance = Math.hypot(cursorPoint.x - point.x, cursorPoint.y - point.y);
						}
						if (distance < minDistance) {
							minDistance = distance;
							closestItem = dataItem;
						}
					}
				})

				$array.each(snapToSeries, (series) => {
					const tooltip = series.get("tooltip");
					if (tooltip) {
						tooltip._setDataItem(undefined);
					}
				})

				if (closestItem) {
					let series = closestItem.component as XYSeries;
					series.showDataItemTooltip(closestItem);
					const point = closestItem.get("point");
					if (point) {
						cursor.handleMove(series.toGlobal(point), true);
					}
				}
			}
		}
	}

	public _updateCursor() {
		let cursor = this.get("cursor");
		if (cursor) {
			cursor.handleMove();
		}
	}

	protected _addCursor(cursor: XYCursor) {
		this.plotContainer.children.push(cursor);
	}

	public _prepareChildren() {
		super._prepareChildren();

		this.series.each((series) => {
			this._colorize(series);
		})

		if (this.isDirty("wheelX") || this.isDirty("wheelY")) {
			this._handleSetWheel();
		}

		if (this.isDirty("cursor")) {
			const previous = this._prevSettings.cursor;
			const cursor = this.get("cursor")!;
			if (cursor !== previous) {
				this._disposeProperty("cursor");
				if (previous) {
					previous.dispose();
				}
				if (cursor) {
					cursor._setChart(this);
					this._addCursor(cursor);

					this._pushPropertyDisposer("cursor", cursor.events.on("selectended", () => {
						this._handleCursorSelectEnd();
					}))
				}

				//this.setRaw("cursor", cursor) // to reset previous value
				this._prevSettings.cursor = cursor;
			}
		}

		if (this.isDirty("scrollbarX")) {
			const previous = this._prevSettings.scrollbarX;
			const scrollbarX = this.get("scrollbarX")!;
			if (scrollbarX !== previous) {
				this._disposeProperty("scrollbarX");
				if (previous) {
					previous.dispose();
				}
				if (scrollbarX) {
					if (!scrollbarX.parent) {
						this.topAxesContainer.children.push(scrollbarX);
					}

					this._pushPropertyDisposer("scrollbarX", scrollbarX.events.on("rangechanged", (e) => {
						this._handleScrollbar(this.xAxes, e.start, e.end);
					}))

					// Used to populate `ariaLabel` with meaningful values
					scrollbarX.setPrivate("positionTextFunction", (position: number) => {
						const axis = this.xAxes.getIndex(0);
						return axis ? axis.getTooltipText(position) || "" : "";
					});

				}

				this._prevSettings.scrollbarX = scrollbarX;
			}
		}

		if (this.isDirty("scrollbarY")) {
			const previous = this._prevSettings.scrollbarY;
			const scrollbarY = this.get("scrollbarY")!;
			if (scrollbarY !== previous) {
				this._disposeProperty("scrollbarY");
				if (previous) {
					previous.dispose();
				}
				if (scrollbarY) {
					if (!scrollbarY.parent) {
						this.rightAxesContainer.children.push(scrollbarY);
					}

					this._pushPropertyDisposer("scrollbarY", scrollbarY.events.on("rangechanged", (e) => {
						this._handleScrollbar(this.yAxes, e.start, e.end);
					}))

					// Used to populate `ariaLabel` with meaningful values
					scrollbarY.setPrivate("positionTextFunction", (position: number) => {
						const axis = this.yAxes.getIndex(0);
						return axis ? axis.getTooltipText(position) || "" : "";
					});

				}
				this._prevSettings.scrollbarY = scrollbarY;
			}
		}

		this._handleZoomOut();
	}

	protected _processSeries(series: this["_seriesType"]) {
		super._processSeries(series);
		this._colorize(series);
	}

	protected _colorize(series: this["_seriesType"]) {
		const colorSet = this.get("colors")!;
		if (colorSet) {
			if (series.get("fill") == null) {
				const color = colorSet.next();

				series._setSoft("stroke", color);
				series._setSoft("fill", color);
			}
		}
	}

	protected _handleCursorSelectEnd() {
		const cursor = this.get("cursor")!;
		const behavior = cursor.get("behavior");

		const downPositionX = cursor.getPrivate("downPositionX", 0);
		const downPositionY = cursor.getPrivate("downPositionY", 0);

		const positionX = cursor.getPrivate("positionX", 0.5);
		const positionY = cursor.getPrivate("positionY", 0.5);


		this.xAxes.each((axis) => {
			if (behavior === "zoomX" || behavior === "zoomXY") {
				let position0 = axis.toAxisPosition(downPositionX);
				let position1 = axis.toAxisPosition(positionX);
				axis.zoom(position0, position1);
			}
			axis.setPrivate("updateScrollbar", true);
		})

		this.yAxes.each((axis) => {
			if (behavior === "zoomY" || behavior === "zoomXY") {
				let position0 = axis.toAxisPosition(downPositionY);
				let position1 = axis.toAxisPosition(positionY);
				axis.zoom(position0, position1);
			}
			axis.setPrivate("updateScrollbar", true);
		})

	}

	protected _handleScrollbar(axes: ListAutoDispose<Axis<any>>, start: number, end: number) {

		axes.each((axis) => {

			let axisStart = axis.fixPosition(start);
			let axisEnd = axis.fixPosition(end);

			let zoomAnimation = axis.zoom(axisStart, axisEnd);

			const updateScrollbar = "updateScrollbar";
			axis.setPrivateRaw(updateScrollbar, false);

			if (zoomAnimation) {
				zoomAnimation.events.on("stopped", () => {
					axis.setPrivateRaw(updateScrollbar, true);
				});
			}
			else {
				axis.setPrivateRaw(updateScrollbar, true);
			}
		})
	}


	protected _processAxis<R extends AxisRenderer>(axes: ListAutoDispose<Axis<R>>, container: Container): IDisposer {
		return axes.events.onAll((change) => {
			if (change.type === "clear") {
				$array.each(change.oldValues, (axis) => {
					this._removeAxis(axis);
				})
			} else if (change.type === "push") {
				container.children.push(change.newValue);
				change.newValue.processChart(this);
			} else if (change.type === "setIndex") {
				container.children.setIndex(change.index, change.newValue);
				change.newValue.processChart(this);
			} else if (change.type === "insertIndex") {
				container.children.insertIndex(change.index, change.newValue);
				change.newValue.processChart(this);
			} else if (change.type === "removeIndex") {
				this._removeAxis(change.oldValue);

			} else {
				throw new Error("Unknown IListEvent type");
			}
		});
	}

	protected _removeAxis(axis: Axis<AxisRenderer>) {
		if (!axis.isDisposed()) {
			const axisParent = axis.parent
			if (axisParent) {
				axisParent.children.removeValue(axis);
			}

			const gridContainer = axis.gridContainer;
			const gridParent = gridContainer.parent;
			if (gridParent) {
				gridParent.children.removeValue(gridContainer);
			}

			const topGridContainer = axis.topGridContainer;
			const topGridParent = topGridContainer.parent;
			if (topGridParent) {
				topGridParent.children.removeValue(topGridContainer);
			}
		}
	}

	public _updateChartLayout() {
		const left = this.leftAxesContainer.width();
		const right = this.rightAxesContainer.width();

		const bottomAxesContainer = this.bottomAxesContainer;
		bottomAxesContainer.set("paddingLeft", left);
		bottomAxesContainer.set("paddingRight", right);

		const topAxesContainer = this.topAxesContainer;
		topAxesContainer.set("paddingLeft", left);
		topAxesContainer.set("paddingRight", right);
	}

	/**
	 * @ignore
	 */
	public processAxis(_axis: Axis<AxisRenderer>) { };

	public _handleAxisSelection(axis: Axis<any>) {

		let start = axis.fixPosition(axis.get("start", 0));
		let end = axis.fixPosition(axis.get("end", 1));

		if (start > end) {
			[start, end] = [end, start];
		}

		if (this.xAxes.indexOf(axis) != -1) {
			if (axis.getPrivate("updateScrollbar")) {
				let scrollbarX = this.get("scrollbarX");
				if (scrollbarX && !scrollbarX.getPrivate("isBusy")) {
					scrollbarX.setRaw("start", start);
					scrollbarX.setRaw("end", end);
					scrollbarX.updateGrips();
				}
			}
		}
		else if (this.yAxes.indexOf(axis) != -1) {
			if (axis.getPrivate("updateScrollbar")) {
				let scrollbarY = this.get("scrollbarY");
				if (scrollbarY && !scrollbarY.getPrivate("isBusy")) {
					scrollbarY.setRaw("start", start);
					scrollbarY.setRaw("end", end);
					scrollbarY.updateGrips();
				}
			}
		}

		this._handleZoomOut();
	}

	protected _handleZoomOut() {
		let zoomOutButton = this.zoomOutButton;
		if (zoomOutButton && zoomOutButton.parent) {
			let visible = false;
			this.xAxes.each((axis) => {
				if (axis.get("start") != 0 || axis.get("end") != 1) {
					visible = true;
				}
			})
			this.yAxes.each((axis) => {
				if (axis.get("start") != 0 || axis.get("end") != 1) {
					visible = true;
				}
			})

			if (visible) {
				if (zoomOutButton.isHidden()) {
					zoomOutButton.show();
				}
			}
			else {
				zoomOutButton.hide();
			}
		}
	}

	/**
	 * Checks if point is within plot area.
	 *
	 * @param   point  Reference point
	 * @return         Is within plot area?
	 */
	public inPlot(point: IPoint): boolean {
		const plotContainer = this.plotContainer;
		const otherCharts = this._otherCharts;
		const global = plotContainer.toGlobal(point);

		if (point.x >= -0.1 && point.y >= -0.1 && point.x <= plotContainer.width() + 0.1 && point.y <= plotContainer.height() + 0.1) {
			return true;
		}
		if (otherCharts) {
			for (let i = otherCharts.length - 1; i >= 0; i--) {
				const chart = otherCharts[i];
				if (chart != this) {
					const chartPlotContainer = chart.plotContainer;
					const local = chartPlotContainer.toLocal(global);
					if (local.x >= -0.1 && local.y >= -0.1 && local.x <= chartPlotContainer.width() + 0.1 && local.y <= chartPlotContainer.height() + 0.1) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * @ignore
	 */
	public arrangeTooltips() {
		const plotContainer = this.plotContainer;

		const w = plotContainer.width();
		const h = plotContainer.height();

		let plotT = plotContainer._display.toGlobal({ x: 0, y: 0 });
		let plotB = plotContainer._display.toGlobal({ x: w, y: h });

		const tooltips: Array<Tooltip> = [];
		let sum = 0;

		let minDistance = Infinity;
		let movePoint = this._movePoint;
		let maxTooltipDistance = this.get("maxTooltipDistance");
		let closest: XYSeries;
		let closestPoint: IPoint;

		if ($type.isNumber(maxTooltipDistance)) {
			this.series.each((series) => {
				const tooltip = series.get("tooltip");
				if (tooltip) {
					let point = tooltip.get("pointTo")!;
					if (point) {
						let distance = Math.hypot(movePoint.x - point.x, movePoint.y - point.y);
						if (distance < minDistance) {
							minDistance = distance;
							closest = series;
							closestPoint = point;
						}
					}
				}
			})
		}

		this.series.each((series) => {
			const tooltip = series.get("tooltip")!;

			if (tooltip) {
				let hidden = false;
				let point = tooltip.get("pointTo")!;
				if (point) {
					if (maxTooltipDistance >= 0) {
						let point = tooltip.get("pointTo")!;
						if (point) {
							if (series != closest) {
								let distance = Math.hypot(closestPoint.x - point.x, closestPoint.y - point.y);
								if (distance > maxTooltipDistance) {
									hidden = true;
								}
							}
						}
					}
					else if (maxTooltipDistance == -1) {
						if (series != closest) {
							hidden = true;
						}
					}

					if (!this.inPlot(this._tooltipToLocal(point)) || !tooltip.dataItem) {
						hidden = true;
					}
					else {
						sum += point.y;
					}

					if (hidden || series.isHidden() || series.isHiding()) {
						tooltip.hide(0);
					}
					else {
						tooltip.show();
						tooltips.push(tooltip);
					}
				}
			}
		})
		if (this.get("arrangeTooltips")) {

			const tooltipContainer = this._root.tooltipContainer;

			tooltips.sort((a, b) => $order.compareNumber(a.get("pointTo")!.y, b.get("pointTo")!.y));
			const count = tooltips.length;
			const average = sum / count;

			if (average > h / 2 + plotT.y) {
				tooltips.reverse();
				let prevY = plotB.y;

				$array.each(tooltips, (tooltip) => {
					let height = tooltip.height();
					let centerY = tooltip.get("centerY");
					if (centerY instanceof Percent) {
						height *= centerY.value;
					}
					height += tooltip.get("marginBottom", 0);

					tooltip.set("bounds", { left: plotT.x, top: plotT.y, right: plotB.x, bottom: prevY })

					prevY = Math.min(prevY - height, tooltip._fy - height);
					tooltipContainer.children.moveValue(tooltip, 0);
				})
			}
			else {
				let prevY = 0;
				$array.each(tooltips, (tooltip) => {
					let height = tooltip.height();
					let centerY = tooltip.get("centerY");
					if (centerY instanceof Percent) {
						height *= centerY.value;
					}
					height += tooltip.get("marginBottom", 0);

					tooltip.set("bounds", { left: plotT.x, top: prevY, right: plotB.x, bottom: Math.max(plotT.y + h, prevY + height) })
					tooltipContainer.children.moveValue(tooltip, 0);
					prevY = Math.max(prevY + height, tooltip._fy + height);
				})
			}
		}
	}

	protected _tooltipToLocal(point: IPoint): IPoint {
		return this.plotContainer.toLocal(point);
	}

	/**
	 * Fully zooms out the chart.
	 */
	public zoomOut() {
		this.xAxes.each((axis) => {
			axis.setPrivate("updateScrollbar", true);
			axis.zoom(0, 1);
		})

		this.yAxes.each((axis) => {
			axis.setPrivate("updateScrollbar", true);
			axis.zoom(0, 1);
		})
	}

}
