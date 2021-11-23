import type { ITimeInterval } from "../../core/util/Time";
import type { DataItem } from "../../core/render/Component";
import type { IValueAxisDataItem, ValueAxis } from "./axes/ValueAxis";
import type { AxisRenderer } from "./axes/AxisRenderer";
import type { DateAxis } from "./axes/DateAxis";
import type { ICategoryAxisDataItem } from "./axes/CategoryAxis";

import { Theme } from "../../core/Theme";
import { percent, p50, p100 } from "../../core/util/Percent";
import { ColorSet } from "../../core/util/ColorSet";
import { setColor } from "../../themes/DefaultTheme";

import * as $type from "../../core/util/Type";
import * as $math from "../../core/util/Math";
import * as $object from "../../core/util/Object";
import * as $array from "../../core/util/Array";

/**
 * @ignore
 */
export class XYChartDefaultTheme extends Theme {
	protected setupDefaultRules() {
		super.setupDefaultRules();

		const ic = this._root.interfaceColors;
		const language = this._root.language;
		const r = this.rule.bind(this);

		/**
		 * ========================================================================
		 * charts/xy
		 * ========================================================================
		 */

		r("XYChart").setAll({
			colors: ColorSet.new(this._root, {}),
			paddingLeft: 20,
			paddingRight: 20,
			paddingTop: 16,
			paddingBottom: 16,
			panX: false,
			panY: false,
			wheelStep: 0.25,
			arrangeTooltips: true
		});


		/**
		 * ------------------------------------------------------------------------
		 * charts/xy: XYChartScrollbar
		 * ------------------------------------------------------------------------
		 */

		r("XYChart", ["scrollbar", "chart"]).setAll({
			paddingBottom: 0,
			paddingLeft: 0,
			paddingTop: 0,
			paddingRight: 0,
			colors: ColorSet.new(this._root, {
				saturation: 0
			})
		});

		{
			const rule = r("Graphics", ["scrollbar", "overlay"]);

			rule.setAll({
				fillOpacity: 0.5
			});

			setColor(rule, "fill", ic, "background");
		}

		// Class: RoundedRectangle
		r("RoundedRectangle", ["xy", "scrollbar", "thumb"]).setAll({
			cornerRadiusTR: 0,
			cornerRadiusTL: 0,
			cornerRadiusBR: 0,
			cornerRadiusBL: 0,
			fillOpacity: 0,
			focusable: true
		});

		r("RoundedRectangle", ["xy", "scrollbar", "thumb"]).states.create("hover", { fillOpacity: 0.4 });

		r("RoundedRectangle", ["xy", "scrollbar", "chart", "background"]).setAll({
			cornerRadiusTL: 0,
			cornerRadiusBL: 0,
			cornerRadiusTR: 0,
			cornerRadiusBR: 0
		});

		r("RoundedRectangle", ["xy", "scrollbar", "chart", "background", "resize", "button"]).setAll({
			cornerRadiusBL: 40,
			cornerRadiusBR: 40,
			cornerRadiusTL: 40,
			cornerRadiusTR: 40
		});

		r("AxisRendererX", ["xy", "chart", "scrollbar"]).setAll({
			strokeOpacity: 0,
			inside: true
		});

		r("AxisRendererY", ["xy", "chart", "scrollbar"]).setAll({
			strokeOpacity: 0,
			inside: true,
			minGridDistance: 5
		});

		r("AxisLabel", ["xy", "scrollbar", "x"]).setAll({
			opacity: 0.5,
			centerY: p100,
			minPosition: 0.01,
			maxPosition: 0.99,
			fontSize: "0.8em"
		});

		r("AxisLabel", ["category"]).setAll({
			text: "{category}",
			populateText: true
		});

		r("AxisLabel", ["x"]).setAll({
			centerY: 0
		});

		r("AxisLabel", ["x", "inside"]).setAll({
			centerY: p100
		});

		r("AxisLabel", ["x", "inside", "opposite"]).setAll({
			centerY: 0
		});

		r("AxisLabel", ["x", "opposite"]).setAll({
			centerY: p100
		});


		r("AxisLabel", ["y"]).setAll({
			centerX: p100
		});

		r("AxisLabel", ["y", "inside"]).setAll({
			centerX: 0
		});

		r("AxisLabel", ["y", "inside", "opposite"]).setAll({
			centerX: p100
		});

		r("AxisLabel", ["y", "opposite"]).setAll({
			centerX: 0
		});


		r("AxisLabel", ["xy", "scrollbar", "y"]).setAll({
			visible: false
		});

		// Class: Grid
		r("Grid", ["xy", "scrollbar", "y"]).setAll({
			visible: false
		});

		// Class: Grid
		r("Grid", ["xy", "scrollbar", "x"]).setAll({
			opacity: 0.5
		});




		/**
		 * ------------------------------------------------------------------------
		 * charts/xy: Cursor
		 * ------------------------------------------------------------------------
		 */

		r("XYCursor").setAll({
			behavior: "none",
			layer: 20,
			exportable: false,
			snapToSeriesBy: "xy"
		});

		{
			const rule = r("Grid", ["cursor", "x"]);

			rule.setAll({
				strokeOpacity: 0.8,
				strokeDasharray: [2, 2]
			});

			setColor(rule, "stroke", ic, "alternativeBackground");
		}

		{
			const rule = r("Grid", ["cursor", "y"]);

			rule.setAll({
				strokeOpacity: 0.8,
				strokeDasharray: [2, 2]
			});

			setColor(rule, "stroke", ic, "alternativeBackground");
		}

		{
			const rule = r("Graphics", ["cursor", "selection"]);

			rule.setAll({
				fillOpacity: 0.15,
			});

			setColor(rule, "fill", ic, "alternativeBackground");
		}


		/**
		 * ------------------------------------------------------------------------
		 * charts/xy: Axes
		 * ------------------------------------------------------------------------
		 */

		r("Axis").setAll({
			start: 0,
			end: 1,
			minZoomCount: 1,
			maxZoomCount: Infinity,
			maxZoomFactor: 1000,
			maxDeviation: 0.1,
			snapTooltip: true,
			tooltipLocation: 0.5,
			panX: true,
			panY: true,
			zoomX: true,
			zoomY: true,
			fixAxisSize: true
		});

		r("AxisLabel").setAll({
			location: 0.5,
			multiLocation: 0,
			centerX: p50,
			centerY: p50,
			paddingTop: 3,
			paddingBottom: 3,
			paddingLeft: 5,
			paddingRight: 5
		});

		// The following is deprecated following text measuring updates in 5.0.5
		// r("AxisLabel", ["y"]).setAll({
		// 	textAlign: "right"
		// });

		// r("AxisLabel", ["y", "opposite"]).setAll({
		// 	textAlign: "left"
		// });

		r("Container", ["axis", "header"]).setAll({
			layer: 30
		});

		{
			const rule = r("AxisRenderer");

			rule.setAll({
				strokeOpacity: 0
			});

			setColor(rule, "stroke", ic, "grid");
		}

		r("AxisRendererX").setAll({
			minGridDistance: 120,
			opposite: false,
			inversed: false,
			cellStartLocation: 0,
			cellEndLocation: 1,
			width: p100
		});

		r("AxisRendererY").setAll({
			minGridDistance: 40,
			opposite: false,
			inversed: false,
			cellStartLocation: 0,
			cellEndLocation: 1,
			height: p100
		});

		{
			const rule = r("Rectangle", ["axis", "thumb"]);

			rule.setAll({
				fillOpacity: 0
			});

			setColor(rule, "fill", ic, "alternativeBackground");

			rule.states.create("hover", { fillOpacity: 0.1 })
		}

		r("Rectangle", ["axis", "thumb", "x"]).setAll({
			cursorOverStyle: "ew-resize"
		});

		r("Rectangle", ["axis", "thumb", "y"]).setAll({
			cursorOverStyle: "ns-resize"
		});


		{
			const rule = r("Grid");

			rule.setAll({
				location: 0,
				strokeOpacity: 0.15,
			});

			setColor(rule, "stroke", ic, "grid");
		}

		r("Grid", ["base"]).setAll({
			strokeOpacity: 0.3
		});

		{
			const rule = r("Graphics", ["axis", "fill"]);

			rule.setAll({
				visible: false,
				isMeasured: false,
				position: "absolute",
				fillOpacity: 0.05,
			});

			setColor(rule, "fill", ic, "alternativeBackground");
		}

		r("Graphics", ["axis", "fill", "range"]).setAll({
			isMeasured: true
		});

		// hides all elements of series axis range
		r("Graphics", ["series", "fill", "range"]).setAll({
			visible: false,
			isMeasured: true
		});

		r("Grid", ["series", "range"]).setAll({
			visible: false
		});

		r("AxisTick", ["series", "range"]).setAll({
			visible: false
		});

		r("AxisLabel", ["series", "range"]).setAll({
			visible: false
		});

		{
			const rule = r("AxisTick");

			rule.setAll({
				location: 0.5,
				multiLocation: 0,
				strokeOpacity: 1,
				isMeasured: false,
				position: "absolute",
				visible: false
			});

			setColor(rule, "stroke", ic, "grid");
		}

		r("CategoryAxis").setAll({
			startLocation: 0,
			endLocation: 1,
			fillRule: (dataItem: DataItem<ICategoryAxisDataItem>, index?: number) => {
				const axisFill = dataItem.get("axisFill");
				if (axisFill) {
					if (!$type.isNumber(index) || index % 2 == 0) {
						axisFill.setPrivate("visible", true);
					}
					else {
						axisFill.setPrivate("visible", false);
					}
				}
			}
		});

		const gridIntervals: Array<ITimeInterval> = [
			{ timeUnit: "millisecond", count: 1 },
			{ timeUnit: "millisecond", count: 5 },
			{ timeUnit: "millisecond", count: 10 },
			{ timeUnit: "millisecond", count: 50 },
			{ timeUnit: "millisecond", count: 100 },
			{ timeUnit: "millisecond", count: 500 },
			{ timeUnit: "second", count: 1 },
			{ timeUnit: "second", count: 5 },
			{ timeUnit: "second", count: 10 },
			{ timeUnit: "second", count: 30 },
			{ timeUnit: "minute", count: 1 },
			{ timeUnit: "minute", count: 5 },
			{ timeUnit: "minute", count: 10 },
			{ timeUnit: "minute", count: 15 },
			{ timeUnit: "minute", count: 30 },
			{ timeUnit: "hour", count: 1 },
			{ timeUnit: "hour", count: 3 },
			{ timeUnit: "hour", count: 6 },
			{ timeUnit: "hour", count: 12 },
			{ timeUnit: "day", count: 1 },
			{ timeUnit: "day", count: 2 },
			{ timeUnit: "day", count: 3 },
			{ timeUnit: "day", count: 4 },
			{ timeUnit: "day", count: 5 },
			{ timeUnit: "week", count: 1 },
			{ timeUnit: "month", count: 1 },
			{ timeUnit: "month", count: 2 },
			{ timeUnit: "month", count: 3 },
			{ timeUnit: "month", count: 6 },
			{ timeUnit: "year", count: 1 },
			{ timeUnit: "year", count: 2 },
			{ timeUnit: "year", count: 5 },
			{ timeUnit: "year", count: 10 },
			{ timeUnit: "year", count: 50 },
			{ timeUnit: "year", count: 100 },
			{ timeUnit: "year", count: 200 },
			{ timeUnit: "year", count: 500 },
			{ timeUnit: "year", count: 1000 },
			{ timeUnit: "year", count: 2000 },
			{ timeUnit: "year", count: 5000 },
			{ timeUnit: "year", count: 10000 },
			{ timeUnit: "year", count: 100000 }
		];

		const dateFormats = {
			"millisecond": language.translate("_date_millisecond"),
			"second": language.translate("_date_second"),
			"minute": language.translate("_date_minute"),
			"hour": language.translate("_date_hour"),
			"day": language.translate("_date_day"),
			"week": language.translate("_date_day"),
			"month": language.translate("_date_month"),
			"year": language.translate("_date_year"),
		};

		const periodChangeDateFormats = {
			"millisecond": language.translate("_date_millisecond"),
			"second": language.translate("_date_second"),
			"minute": language.translate("_date_minute"),
			"hour": language.translate("_date_day"),
			"day": language.translate("_date_day"),
			"week": language.translate("_date_day"),
			"month": language.translate("_date_month") + " " + language.translate("_date_year"),
			"year": language.translate("_date_year")
		};

		r("CategoryDateAxis").setAll({
			markUnitChange: true,
			gridIntervals: $array.copy(gridIntervals),
			dateFormats: $object.copy(dateFormats),
			periodChangeDateFormats: $object.copy(periodChangeDateFormats)
		});

		r("DateAxis").setAll({

			strictMinMax: true,
			startLocation: 0,
			endLocation: 1,
			markUnitChange: true,
			groupData: false,
			groupCount: 500,
			gridIntervals: $array.copy(gridIntervals),
			dateFormats: $object.copy(dateFormats),
			periodChangeDateFormats: $object.copy(periodChangeDateFormats),

			groupIntervals: [
				{ timeUnit: "millisecond", count: 1 },
				{ timeUnit: "millisecond", count: 10 },
				{ timeUnit: "millisecond", count: 100 },
				{ timeUnit: "second", count: 1 },
				{ timeUnit: "second", count: 10 },
				{ timeUnit: "minute", count: 1 },
				{ timeUnit: "minute", count: 10 },
				{ timeUnit: "hour", count: 1 },
				{ timeUnit: "day", count: 1 },
				{ timeUnit: "week", count: 1 },
				{ timeUnit: "month", count: 1 },
				{ timeUnit: "year", count: 1 }
			],

			fillRule: (dataItem: DataItem<IValueAxisDataItem>) => {
				const axisFill = dataItem.get("axisFill");
				if (axisFill) {
					const axis = <DateAxis<AxisRenderer>>dataItem.component;
					const value = dataItem.get("value");
					const step = axis.getPrivate("step");
					const min = axis.getPrivate("min", 0);
					const intervalDuration = axis.intervalDuration();

					if ($type.isNumber(value) && $type.isNumber(step)) {
						if (Math.round((value - min) / intervalDuration) / 2 == Math.round(Math.round((value - min) / intervalDuration) / 2)) {
							axisFill.setPrivate("visible", true);
						}
						else {
							axisFill.setPrivate("visible", false);
						}
					}
				}
			}
		});


		r("ValueAxis").setAll({

			baseValue: 0,
			logarithmic: false,
			extraMin: 0,
			extraMax: 0,
			strictMinMax: false,

			fillRule: (dataItem: DataItem<IValueAxisDataItem>) => {
				const axisFill = dataItem.get("axisFill");
				if (axisFill) {
					const axis = <ValueAxis<AxisRenderer>>dataItem.component;
					const value = dataItem.get("value");
					const step = axis.getPrivate("step");

					if ($type.isNumber(value) && $type.isNumber(step)) {
						if ($math.round(value / step / 2, 5) == Math.round(value / step / 2)) {
							axisFill.setPrivate("visible", false);
						}
						else {
							axisFill.setPrivate("visible", true);
						}
					}
				}
			}
		});

		r("DurationAxis").setAll({
			baseUnit: "second"
		})


		/**
		 * ------------------------------------------------------------------------
		 * charts/xy: Series
		 * ------------------------------------------------------------------------
		 */

		r("XYSeries").setAll({
			maskBullets: true,
			stackToNegative: true,

			locationX: 0.5,
			locationY: 0.5,

			snapTooltip: false,

			openValueXGrouped: "open",
			openValueYGrouped: "open",
			valueXGrouped: "close",
			valueYGrouped: "close",

			seriesTooltipTarget: "series"
		});

		r("BaseColumnSeries").setAll({
			adjustBulletPosition: true
		});

		r("ColumnSeries").setAll({
			clustered: true
		});

		r("RoundedRectangle", ["series", "column"]).setAll({
			position: "absolute",
			isMeasured: false,
			width: percent(70),
			height: percent(70),
			strokeWidth: 1,
			strokeOpacity: 1,
			cornerRadiusBL: 0,
			cornerRadiusTL: 0,
			cornerRadiusBR: 0,
			cornerRadiusTR: 0,
			fillOpacity: 1,
			role: "figure"
		});

		r("LineSeries").setAll({
			connect: true,
			autoGapCount: 1.1,
			stackToNegative: false
		});

		r("Graphics", ["series", "stroke"]).setAll({
			position: "absolute",
			strokeWidth: 1,
			strokeOpacity: 1,
			isMeasured: false
		});

		r("Graphics", ["series", "fill"]).setAll({
			visible: false,
			fillOpacity: 0,
			position: "absolute",
			strokeWidth: 0,
			strokeOpacity: 0,
			isMeasured: false
		});

		r("Graphics", ["line", "series", "legend", "marker", "stroke"]).setAll({
			draw: (display: any, sprite: any) => {
				const parent = sprite.parent;
				if (parent) {
					const h = parent.height();
					const w = parent.width();
					display.moveTo(0, h / 2);
					display.lineTo(w, h / 2);
				}
			}
		});

		{
			const rule = r("Graphics", ["line", "series", "legend", "marker", "stroke"]).states.create("disabled", {});
			setColor(rule, "stroke", ic, "disabled");
		}

		r("Graphics", ["line", "series", "legend", "marker", "fill"]).setAll({
			draw: (display: any, sprite: any) => {
				const parent = sprite.parent;
				if (parent) {
					const h = parent.height();
					const w = parent.width();
					display.moveTo(0, 0);
					display.lineTo(w, 0);
					display.lineTo(w, h);
					display.lineTo(0, h);
					display.lineTo(0, 0);
				}
			}
		});

		{
			const rule = r("Graphics", ["line", "series", "legend", "marker", "fill"]).states.create("disabled", {});
			setColor(rule, "stroke", ic, "disabled");
		}

		r("SmoothedXYLineSeries").setAll({
			tension: 0.5
		});

		r("SmoothedXLineSeries").setAll({
			tension: 0.5
		});

		r("SmoothedYLineSeries").setAll({
			tension: 0.5
		});

		r("Candlestick").setAll({
			position: "absolute",
			isMeasured: false,
			width: percent(50),
			height: percent(50),
			strokeWidth: 1,
			strokeOpacity: 1,
			cornerRadiusBL: 0,
			cornerRadiusTL: 0,
			cornerRadiusBR: 0,
			cornerRadiusTR: 0,
			fillOpacity: 1,
			role: "figure"
		});

		r("OHLC").setAll({
			width: percent(80),
			height: percent(80)
		});

		r("CandlestickSeries").setAll({
			lowValueXGrouped: "low",
			lowValueYGrouped: "low",
			highValueXGrouped: "high",
			highValueYGrouped: "high",
			openValueXGrouped: "open",
			openValueYGrouped: "open",
			valueXGrouped: "close",
			valueYGrouped: "close"
		})

		// These rules can be used for regular columns, too
		{
			const rule = r("Rectangle", ["column", "autocolor"]).states.create("riseFromOpen", {});
			setColor(rule, "fill", ic, "positive");
			setColor(rule, "stroke", ic, "positive");
		}

		{
			const rule = r("Rectangle", ["column", "autocolor"]).states.create("dropFromOpen", {});
			setColor(rule, "fill", ic, "negative");
			setColor(rule, "stroke", ic, "negative");
		}

		r("Rectangle", ["column", "autocolor", "pro"]).states.create("riseFromPrevious", { fillOpacity: 1 });
		r("Rectangle", ["column", "autocolor", "pro"]).states.create("dropFromPrevious", { fillOpacity: 0 });

	}
}
