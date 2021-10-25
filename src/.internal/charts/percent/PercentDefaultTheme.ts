import { Theme } from "../../core/Theme";
import { percent, p50, p100 } from "../../core/util/Percent";
import { ColorSet } from "../../core/util/ColorSet";
import { setColor } from "../../themes/DefaultTheme";


/**
 * @ignore
 */
export class PercentDefaultTheme extends Theme {
	protected setupDefaultRules() {
		super.setupDefaultRules();

		const ic = this._root.interfaceColors;

		/**
		 * ========================================================================
		 * charts/percent
		 * ========================================================================
		 */

		this.rule("PercentSeries").setAll({
			legendLabelText: "{category}",
			legendValueText: "{valuePercentTotal.formatNumber('0.00')}%",
			colors: ColorSet.new(this._root, {}),
			width: p100,
			height: p100
		});

		/**
		 * ========================================================================
		 * charts/pie
		 * ========================================================================
		 */

		this.rule("PieChart").setAll({
			radius: percent(80),
			startAngle: -90,
			endAngle: 270
		})

		this.rule("PieSeries").setAll({
			alignLabels: true,
			startAngle: -90,
			endAngle: 270
		});

		this.rule("PieSeries").states.create("hidden", { endAngle: -90, opacity: 0 });

		this.rule("Slice", ["pie"]).setAll({
			position: "absolute",
			isMeasured: false,
			x: 0,
			y: 0,
			toggleKey: "active",
			tooltipText: "{category}: {valuePercentTotal.formatNumber('0.00')}%",
			strokeWidth: 1,
			strokeOpacity: 1,
			role: "figure"
		});

		this.rule("Slice", ["pie"]).states.create("active", { shiftRadius: 20 });
		this.rule("Slice", ["pie"]).states.create("hover", { scale: 1.04 });

		this.rule("RadialLabel", ["pie"]).setAll({
			textType: "aligned",
			radius: 10,
			text: "{category}: {valuePercentTotal.formatNumber('0.00')}%",
			paddingTop: 5,
			paddingBottom: 5,
			populateText: true
		});

		this.rule("Tick", ["pie"]).setAll({
			location: 1
		});


		/**
		 * ========================================================================
		 * charts/funnel
		 * ========================================================================
		 */

		this.rule("SlicedChart").setAll({
			paddingLeft: 10,
			paddingRight: 10,
			paddingTop: 10,
			paddingBottom: 10
		});

		/**
		 * ------------------------------------------------------------------------
		 * charts/funnel: Funnel
		 * ------------------------------------------------------------------------
		 */

		this.rule("FunnelSeries").setAll({
			startLocation: 0,
			endLocation: 1,
			orientation: "vertical",
			alignLabels: true,
			sequencedInterpolation: true
		});

		this.rule("FunnelSlice").setAll({
			interactive: true,
			expandDistance: 0,
			//tooltipText: "{category}: {valuePercentTotal.formatNumber('0.00')}%"
		});

		this.rule("FunnelSlice").states.create("hover", { expandDistance: 0.15 })

		this.rule("Label", ["funnel"]).setAll({
			populateText: true,
			text: "{category}: {valuePercentTotal.formatNumber('0.00')}%",
			centerY: p50
		});

		this.rule("Label", ["funnel", "horizontal"]).setAll({
			centerX: 0,
			centerY: p50,
			rotation: -90
		});

		// Class: Label
		this.rule("Label", ["funnel", "vertical"]).setAll({
			centerY: p50,
			centerX: 0
		});

		this.rule("Tick", ["funnel"]).setAll({
			location: 1
		});

		this.rule("FunnelSlice", ["funnel", "link"]).setAll({
			fillOpacity: 0.5,
			strokeOpacity: 0,
			expandDistance: -0.1
		});

		this.rule("FunnelSlice", ["funnel", "link", "vertical"]).setAll({
			height: 10,
		});

		this.rule("FunnelSlice", ["funnel", "link", "horizontal"]).setAll({
			width: 10
		});


		/**
		 * ------------------------------------------------------------------------
		 * charts/funnel: Pyramid
		 * ------------------------------------------------------------------------
		 */

		this.rule("PyramidSeries").setAll({
			valueIs: "area"
		});

		this.rule("FunnelSlice", ["pyramid", "link"]).setAll({
			fillOpacity: 0.5
		});

		this.rule("FunnelSlice", ["pyramid", "link", "vertical"]).setAll({
			height: 0
		});

		this.rule("FunnelSlice", ["pyramid", "link", "horizontal"]).setAll({
			width: 0
		});

		this.rule("FunnelSlice", ["pyramid"]).setAll({
			interactive: true,
			expandDistance: 0
		});

		this.rule("FunnelSlice", ["pyramid"]).states.create("hover", { expandDistance: 0.15 });

		this.rule("Label", ["pyramid"]).setAll({
			populateText: true,
			text: "{category}: {valuePercentTotal.formatNumber('0.00')}%",
			centerY: p50
		});

		this.rule("Label", ["pyramid", "horizontal"]).setAll({
			centerX: 0,
			centerY: p50,
			rotation: -90
		});

		this.rule("Label", ["pyramid", "vertical"]).setAll({
			centerY: p50,
			centerX: 0
		});

		this.rule("Tick", ["pyramid"]).setAll({
			location: 1
		});


		/**
		 * ------------------------------------------------------------------------
		 * charts/funnel: Pictorial
		 * ------------------------------------------------------------------------
		 */

		// Class: FunnelSlice
		this.rule("FunnelSlice", ["pictorial"]).setAll({
			interactive: true,
			tooltipText: "{category}: {valuePercentTotal.formatNumber('0.00')}%"
		});

		this.rule("Label", ["pictorial"]).setAll({
			populateText: true,
			text: "{category}: {valuePercentTotal.formatNumber('0.00')}%",
			centerY: p50
		});

		this.rule("Label", ["pictorial", "horizontal"]).setAll({
			centerX: 0,
			centerY: p50,
			rotation: -90
		});

		this.rule("Label", ["pictorial", "vertical"]).setAll({
			centerY: p50,
			centerX: 0
		});

		this.rule("FunnelSlice", ["pictorial", "link"]).setAll({
			fillOpacity: 0.5,
			width: 0,
			height: 0
		});

		this.rule("Tick", ["pictorial"]).setAll({
			location: 0.5
		});

		{
			const rule = this.rule("Graphics", ["pictorial", "background"]);

			rule.setAll({
				fillOpacity: 0.2
			});

			setColor(rule, "fill", ic, "alternativeBackground");
		}

	}
}
