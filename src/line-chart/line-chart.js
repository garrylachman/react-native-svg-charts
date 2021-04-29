import * as shape from 'd3-shape'
import PropTypes from 'prop-types'
import { Chart } from '../chart/chart'

const LineChart = (props) => {
    const _createPaths = ({ data, x, y }) => {
        const { curve, start } = props

        const line = shape
            .line()
            .x((d) => x(d.x))
            .y((d) => y(d.y))
            .defined((item) => typeof item.y === 'number')
            .curve(curve)(data)

        return {
            path: area,
            line,
        }
    }
    return Chart({
        ...props,
        createPaths: _createPaths
    });
}

LineChart.propTypes = {
    ...Chart.propTypes,
}

LineChart.defaultProps = {
    ...Chart.defaultProps,
}

export default LineChart
