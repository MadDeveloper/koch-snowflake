var totalSteps = 0;

$( function() {
    $( document ).ready( function() {

        var $window     = $( window );
        var $myCanvas   = document.querySelector( '#my-canvas' );
        var myContext   = $myCanvas.getContext( '2d' );
        var $range      = $( '#range' );

        $range.on( 'change', function() {
            totalSteps = $range.val();
            start();
        });

        var SLOPE = {
            DOWN: 0,
            UP: 1,
            NO: 2
        };

        var SLOPE_TYPE = {
            NO: {
                RIGHT: 0,
                LEFT: 1
            },
            DOWN: {
                RIGHT: 0,
                LEFT: 1
            },
            UP: {
                RIGHT: 0,
                LEFT: 1
            }
        }

        $myCanvas.width     = $window.width();
        $myCanvas.height    = $window.height();

        var config = {
            startLine: {
                width: 500
            }
        };

        var heightStartTriangle = Math.sqrt( Math.pow( config.startLine.width, 2 ) - Math.pow( config.startLine.width / 2 , 2 ) );

        config.startPoint = {
            x: ( $myCanvas.width / 2 ) - ( config.startLine.width / 2 ),
            y: $myCanvas.height / 2 - ( heightStartTriangle / 2 )
        };

        config.endPoint = {
            x: ( $myCanvas.width / 2 ) + ( config.startLine.width / 2 ),
            y: $myCanvas.height / 2 - ( heightStartTriangle / 2 )
        };


        config.intermediatePoint = {
            x: $myCanvas.width / 2,
            y: $myCanvas.height / 2 + ( heightStartTriangle / 2 )
        };

        var vertices = []

        start();

        /*
         * Functions
         */

        function start() {
            clearCanvas();
            initVertices();

            for ( var step = 1; step <= totalSteps; step++ ) {
                defineVertices();
            }

            drawLines();
        }

        function initVertices() {
            vertices = [
                {
                    x: config.startPoint.x,
                    y: config.startPoint.y
                },
                {
                    x: config.endPoint.x,
                    y: config.endPoint.y
                },
                {
                    x: config.intermediatePoint.x,
                    y: config.intermediatePoint.y
                },
                {
                    x: config.startPoint.x,
                    y: config.startPoint.y
                }
            ];
        }

        function defineVertices() {
            var verticesTmp = [];
            var lastVertice = {};
            var newVertices = {
                first: {},
                second: {},
                third: {}
            };
            var delta = 0;
            var baseTriangle = 0;
            var heightTriangle = 0;

            for ( var vertice of vertices ) {
                if ( JSON.stringify( lastVertice ) === JSON.stringify( {} ) ) {

                    verticesTmp.push( vertice );
                    lastVertice = vertice;
                    continue;

                } else {
                    delta = Math.sqrt( Math.pow( vertice.x - lastVertice.x, 2 ) + Math.pow( vertice.y - lastVertice.y, 2 ) );
                    baseTriangle = delta / 3;
                    heightTriangle = Math.sqrt( Math.pow( baseTriangle, 2 ) - Math.pow( baseTriangle / 2 , 2 ) );

                    switch ( determineLineSlope( lastVertice, vertice ) ) {
                        case SLOPE.DOWN:
                            switch ( determineSlopeDownType( lastVertice, vertice ) ) {
                                case SLOPE_TYPE.DOWN.LEFT:
                                    newVertices.first = {
                                        x: lastVertice.x - ( baseTriangle / 2 ),
                                        y: lastVertice.y + heightTriangle
                                    };
                                    newVertices.second = {
                                        x: newVertices.first.x + ( baseTriangle / 2 ),
                                        y: newVertices.first.y + heightTriangle
                                    };
                                    newVertices.third = {
                                        x: newVertices.second.x - baseTriangle,
                                        y: newVertices.second.y
                                    };
                                    break;
                                case SLOPE_TYPE.DOWN.RIGHT:
                                    newVertices.first = {
                                        x: lastVertice.x + ( baseTriangle / 2 ),
                                        y: lastVertice.y + heightTriangle
                                    };
                                    newVertices.second = {
                                        x: newVertices.first.x + baseTriangle,
                                        y: newVertices.first.y
                                    };
                                    newVertices.third = {
                                        x: newVertices.second.x - ( baseTriangle / 2 ),
                                        y: newVertices.second.y + heightTriangle
                                    };
                                    break;
                            }
                            break;
                        case SLOPE.UP:
                            switch ( determineSlopeUpType( lastVertice, vertice ) ) {
                                case SLOPE_TYPE.UP.LEFT:
                                    newVertices.first = {
                                        x: lastVertice.x - ( baseTriangle / 2 ),
                                        y: lastVertice.y - heightTriangle
                                    };
                                    newVertices.second = {
                                        x: newVertices.first.x - baseTriangle,
                                        y: newVertices.first.y
                                    };
                                    newVertices.third = {
                                        x: newVertices.second.x + ( baseTriangle / 2 ),
                                        y: newVertices.second.y - heightTriangle
                                    };
                                    break;
                                case SLOPE_TYPE.UP.RIGHT:
                                    newVertices.first = {
                                        x: lastVertice.x + ( baseTriangle / 2 ),
                                        y: lastVertice.y - heightTriangle
                                    };
                                    newVertices.second = {
                                        x: newVertices.first.x - ( baseTriangle / 2 ),
                                        y: newVertices.first.y - heightTriangle
                                    };
                                    newVertices.third = {
                                        x: newVertices.second.x + baseTriangle,
                                        y: newVertices.second.y
                                    };
                                    break;
                            }
                            break;
                        case SLOPE.NO:
                            switch ( determineSlopeNoType( lastVertice, vertice ) ) {
                                case SLOPE_TYPE.NO.LEFT:
                                    newVertices.first = {
                                        x: lastVertice.x - baseTriangle,
                                        y: lastVertice.y
                                    };
                                    newVertices.second = {
                                        x: newVertices.first.x - ( baseTriangle / 2 ),
                                        y: newVertices.first.y + heightTriangle
                                    };
                                    newVertices.third = {
                                        x: newVertices.second.x - ( baseTriangle / 2 ),
                                        y: newVertices.second.y - heightTriangle
                                    };
                                    break;
                                case SLOPE_TYPE.NO.RIGHT:
                                    newVertices.first = {
                                        x: lastVertice.x + baseTriangle,
                                        y: lastVertice.y
                                    };
                                    newVertices.second = {
                                        x: newVertices.first.x + ( baseTriangle / 2 ),
                                        y: lastVertice.y - heightTriangle
                                    };
                                    newVertices.third = {
                                        x: newVertices.first.x + baseTriangle,
                                        y: lastVertice.y
                                    };
                                    break;
                            }
                            break;
                    }

                    verticesTmp.push( newVertices.first );
                    verticesTmp.push( newVertices.second );
                    verticesTmp.push( newVertices.third );
                    verticesTmp.push( vertice );
                    lastVertice = vertice;

                }
            }

            vertices = clone( verticesTmp );
        }

        function determineLeadingCoefficient( a, b ) {
            return ( b.y - a.y ) / ( b.x - a.x );
        }

        function determineLineSlope( a, b ) {
            var leadingCoefficient = determineLeadingCoefficient( a, b );

            if ( ( leadingCoefficient > 0 && a.x < b.x ) || ( leadingCoefficient < 0 && a.x > b.x ) ) {
                return SLOPE.DOWN;
            } else if ( ( leadingCoefficient < 0 && a.x < b.x ) || ( leadingCoefficient > 0 && a.x > b.x ) ) {
                return SLOPE.UP;
            } else {
                return SLOPE.NO;
            }
        }

        function determineSlopeNoType( a, b ) {
            if ( a.x > b.x ) {
                return SLOPE_TYPE.NO.LEFT;
            } else {
                return SLOPE_TYPE.NO.RIGHT;
            }
        }

        function determineSlopeUpType( a, b ) {
            if ( a.x > b.x ) {
                return SLOPE_TYPE.UP.LEFT;
            } else {
                return SLOPE_TYPE.UP.RIGHT;
            }
        }

        function determineSlopeDownType( a, b ) {
            if ( a.x > b.x ) {
                return SLOPE_TYPE.DOWN.LEFT;
            } else {
                return SLOPE_TYPE.DOWN.RIGHT;
            }
        }

        function drawLines() {
            myContext.beginPath();
            myContext.strokeStyle = "blue";
            myContext.moveTo( config.startPoint.x, config.startPoint.y );

            for ( var vertice of vertices ) {
                myContext.lineTo( vertice.x, vertice.y );
                myContext.moveTo( vertice.x, vertice.y );
            }

            myContext.stroke();
        }

        function clearCanvas() {
            myContext.clearRect( 0, 0, $myCanvas.width, $myCanvas.height );
        }

        function clone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }

    });
});
