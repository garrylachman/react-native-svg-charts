import * as shape from 'd3-shape'
import PropTypes from 'prop-types'
import { Chart } from './chart/chart'

const AreaChart = (props) => {
    const _createPaths = ({ data, x, y }) => {
        const { curve, start } = props
        const area = shape
            .area()
            .x((d) => x(d.x))
            .y0(y(start))
            .y1((d) => y(d.y))
            .defined((item) => typeof item.y === 'number')
            .curve(curve)(data)

        const line = shape
            .line()
            .x((d) => x(d.x))
            .y((d) => y(d.y))
            .defined((item) => typeof item.y === 'number')
            .curve(curve)(data)

        return {
            path: area,
            area,
            line,
        }
    }
    return Chart({
        ...props,
        createPaths: _createPaths
    });
}

AreaChart.propTypes = {
    ...Chart.propTypes,
    start: PropTypes.number,
}

AreaChart.defaultProps = {
    ...Chart.defaultProps,
    start: 0,
}

export default AreaChart
