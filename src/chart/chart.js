import * as array from 'd3-array'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import PropTypes from 'prop-types'
import React, { useMemo, useState, useCallback } from 'react'
import { View } from 'react-native'
import { Svg } from 'react-native-svg'
import Path from '../animated-path'

export const Chart = (props) => {
    const [state, setState] = useState({
        width: 0,
        height: 0
    });

    const _onLayout = (event) => {
        const {
            nativeEvent: {
                layout: { height, width },
            },
        } = event
        setState({ height, width })
    }

    const createPaths = useCallback(props.createPaths, [props.createPaths])

    const {
        data,
        xAccessor,
        yAccessor,
        yScale,
        xScale,
        style,
        animate,
        animationDuration,
        numberOfTicks,
        contentInset: { top = 0, bottom = 0, left = 0, right = 0 },
        gridMax,
        gridMin,
        clampX,
        clampY,
        svg,
        children,
    } = props

    const mappedData = useMemo(() => data.map((item, index) => ({
        y: yAccessor({ item, index }),
        x: xAccessor({ item, index }),
    })), [data]);

    const yValues = mappedData.map((item) => item.y)
    const xValues = mappedData.map((item) => item.x)

    const yExtent = array.extent([...yValues, gridMin, gridMax])
    const xExtent = array.extent([...xValues])

    const { yMin = yExtent[0], yMax = yExtent[1], xMin = xExtent[0], xMax = xExtent[1] } = props;

    const y = useMemo(() => yScale()
        .domain([yMin, yMax])
        .range([state.height - bottom, top])
        .clamp(clampY), [yMin, yMax, state.height, bottom, top, clampY]);

    const x = useMemo(() => xScale()
        .domain([xMin, xMax])
        .range([left, state.width - right])
        .clamp(clampX), [xMin, xMax, left, state.width, right, clampX]);

    const paths = useMemo(() => createPaths({
        data: mappedData,
        x,
        y,
    }), [mappedData, x, y]);

    const ticks = useMemo(() => y.ticks(numberOfTicks), [numberOfTicks]);

    const extraProps = {
        x,
        y,
        data,
        ticks,
        ...state,
        ...paths,
    }

    const DrawPath = useCallback(() => (
        <Path
            fill={'none'}
            {...svg}
            d={paths.path}
            animate={animate}
            animationDuration={animationDuration}
        />
    ), [paths.path]);

    return (
        <>
            {data.length === 0 && <View style={style} />}
            {data.length > 0 && 
                <View style={style}>
                    <View style={{ flex: 1 }} onLayout={(event) => _onLayout(event)}>
                        {state.height > 0 && state.width > 0 && (
                            <Svg>
                                {React.Children.map(children, (child) => {
                                    if (child && child.props.belowChart) {
                                        return React.cloneElement(child, extraProps)
                                    }
                                    return null
                                })}
                                <DrawPath />
                                {React.Children.map(children, (child) => {
                                    if (child && !child.props.belowChart) {
                                        return React.cloneElement(child, extraProps)
                                    }
                                    return null
                                })}
                            </Svg>
                        )}
                    </View>
                </View>
            }
        </>
    )
}

Chart.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.arrayOf(PropTypes.array),
    ]).isRequired,
    svg: PropTypes.object,

    style: PropTypes.any,

    animate: PropTypes.bool,
    animationDuration: PropTypes.number,

    curve: PropTypes.func,
    contentInset: PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
    }),
    numberOfTicks: PropTypes.number,

    gridMin: PropTypes.number,
    gridMax: PropTypes.number,

    yMin: PropTypes.any,
    yMax: PropTypes.any,
    xMin: PropTypes.any,
    xMax: PropTypes.any,
    clampX: PropTypes.bool,
    clampY: PropTypes.bool,

    xScale: PropTypes.func,
    yScale: PropTypes.func,

    xAccessor: PropTypes.func,
    yAccessor: PropTypes.func,

    createPaths: PropTypes.func
}

Chart.defaultProps = {
    svg: {},
    width: 100,
    height: 100,
    curve: shape.curveLinear,
    contentInset: {},
    numberOfTicks: 10,
    xScale: scale.scaleLinear,
    yScale: scale.scaleLinear,
    xAccessor: ({ index }) => index,
    yAccessor: ({ item }) => item
}
