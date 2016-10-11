/* There's no AVL logic in this code.
*  All of the data for what operations should happen is pre-generated.
*  This code only renders the pre-generated content.
*  Sorry, you still have to do all of the coding work yourself :)
*/

var test;
window.onload = function () {
	for (var i = 0; i < tests.length; i++) {
		var option = document.createElement('option');
		option.innerHTML = tests[i].name;
		option.value = i;

		document.getElementById('testSelect').appendChild(option);
	}

	document.getElementById('testSelect').onchange = function () {
		test = tests[this.value];

		var svg = d3.select('svg');
		svg.selectAll("*").remove();
		var WIDTH = 960;
		var HEIGHT = 600;
		var duration = parseInt(document.getElementById('numberInput').value);

		elements = {};

		var radii = [80, 70, 60, 40, 20, 15];
		var radius = radii[test.maxHeight];	

		var circleNode = function (text) {
			var dur = duration / 2;
			var node = svg.append('svg')
				.attr('overflow', 'visible');

			var circle = node.append('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('fill', 'black')
				.transition()
				.duration(dur)
				.attr('r', radius * 4 / 5)
				.attr('stroke-width', radius / 5);

			var label = node.append('text')
				.classed('label', true)
				.text(text)
				.attr('alignment-baseline', 'middle')
				.attr('text-anchor', 'middle')
				.attr('font-size', radius)
				.style('transform', 'translateY(-.1em)')
				.style('opacity', 0);

			var heightLabel = node.append('text')
				.classed('height', true)
				.text(0)
				.attr('alignment-baseline', 'middle')
				.attr('text-anchor', 'middle')
				.attr('font-size', radius / 2.5)
				.style('transform', 'translateY(1.2em)')
				.style('opacity', 0);

			window.setTimeout(function () {
				label.transition()
					.duration(dur / 2)
					.style('opacity', 1);

				heightLabel.transition()
					.duration(dur / 2)
					.style('opacity', 1);
			}, dur / 2);

			return node;
		};

		var actionCallbacks = {
			"spawnNode": function (data) {
				var location = getLocation(data.location);

				elements[data.data] = {
					node: circleNode(data.data).attr('x', location.x).attr('y', location.y),
					leftLink: null,
					rightLink: null,
					location: data.location
				};
			},
			"highlight": function (data) {
				elements[data.data].node.selectAll('circle').classed('highlighted', true);
			},
			"update": function (data) {
				for (var element in data.updates) {
					var leftTransition = undefined;
					var rightTransition = undefined;

					if (elements[element].leftLink !== null) {
						leftTransition = elements[element].leftLink.transition().duration(duration / 2);
					}
					if (elements[element].rightLink !== null) {
						rightTransition = elements[element].rightLink.transition().duration(duration / 2);
					}

					if (data.updates[element].location !== undefined) {
						elements[element].location = data.updates[element].location;
						var newPoint = getLocation(data.updates[element].location);

						elements[element].node.transition()
							.duration(duration / 2)
							.attr('x', newPoint.x)
							.attr('y', newPoint.y);

						if (leftTransition !== undefined) {
							var leftPoint = getLeftPoint(data.updates[element].location);
							leftTransition.attr('x1', leftPoint.x);
							leftTransition.attr('y1', leftPoint.y);
						}

						if (rightTransition !== undefined) {
							var rightPoint = getRightPoint(data.updates[element].location);
							rightTransition.attr('x1', rightPoint.x);
							rightTransition.attr('y1', rightPoint.y);
						}
					}

					if (data.updates[element].left !== undefined) {
						if (data.updates[element].left === null) {
							// remove an existing link, if it existed
							if (elements[element].leftLink !== null) {
								// fade out left link
								leftTransition.style('opacity', 0);

								elements[element].leftLink = null;
							}
						} else {
							var newPoint = getTopPoint(data.updates[element].left);

							if (elements[element].leftLink === null) {
								var point = getLeftPoint(elements[element].location);

								elements[element].leftLink = svg.append('line')
									.attr('x1', point.x)
									.attr('x2', point.x)
									.attr('y1', point.y)
									.attr('y2', point.y)
									.attr('stroke-width', '2')
									.attr('stroke', 'black');

								leftTransition = elements[element].leftLink.transition().duration(duration / 2);
							}

							leftTransition
								.attr('x2', newPoint.x)
								.attr('y2', newPoint.y);
						}
					}

					if (data.updates[element].right !== undefined) {
						if (data.updates[element].right === null) {
							// remove an existing link, if it existed
							if (elements[element].rightLink !== null) {
								// fade out right link
								rightTransition.style('opacity', 0);

								elements[element].rightLink = null;
							}
						} else {
							var newPoint = getTopPoint(data.updates[element].right);

							if (elements[element].rightLink === null) {
								var point = getRightPoint(elements[element].location);

								elements[element].rightLink = svg.append('line')
									.attr('x1', point.x)
									.attr('x2', point.x)
									.attr('y1', point.y)
									.attr('y2', point.y)
									.attr('stroke-width', '2')
									.attr('stroke', 'black');

								rightTransition = elements[element].rightLink.transition().duration(duration / 2);
							}

							rightTransition
								.attr('x2', newPoint.x)
								.attr('y2', newPoint.y);
						}
					}
				}
			},
			"highlightUpdateHeight": function (data) {
				elements[data.data].node.selectAll('circle').classed('highlighted', true);	
				elements[data.data].node.selectAll('.height').text(data.height);
			},
			"remove": function (data) {
				elements[data.data].node.selectAll('text').transition().duration(duration / 4).style('opacity', 0);
				elements[data.data].node.selectAll('circle').transition().duration(duration / 2)
					.attr('r', 0)
					.attr('stroke-width', 0);
				if (elements[data.data].leftLink !== null) {
					elements[data.data].leftLink.transition(duration / 2).style('opacity', 0);
				}
				if (elements[data.data].rightLink !== null) {
					elements[data.data].rightLink.transition(duration / 2).style('opacity', 0);
				}
				window.setTimeout(function () {
					elements[data.data].node.remove();
					if (elements[data.data].leftLink !== null) {
						elements[data.data].leftLink.remove();
					}
					if (elements[data.data].rightLink !== null) {
						elements[data.data].rightLink.remove();
					}
					elements[data.data] = undefined;
				}, duration / 2);
			},
			"replace": function (data) {
				elements[data.newName + '-old'] = elements[data.newName];
				elements[data.newName] = elements[data.oldObject];
				elements[data.oldObject] = undefined;

				elements[data.newName].node.selectAll('circle').classed('highlighted', true);
				elements[data.newName].node.selectAll('.label').text(data.newName);
			}
		};

		// y is positive down

		var getLocation = function (to) {
			var y = (to.length + 1) * HEIGHT / (test.maxHeight + 1) - HEIGHT / ((test.maxHeight + 1) * 2);
			var x = WIDTH / 2;
			var horizontalSpace = WIDTH / Math.pow(2, to.length);
			for (var i = 0; i < to.length; i++) {
				var pixelsPerCircleAtThisLevel = WIDTH / Math.pow(2, i + 1);
				x += to[i] * .5 * pixelsPerCircleAtThisLevel;
			}
			return {
				x: x,
				y: y
			};
		}

		var getLeftPoint = function (to) {
			var nodeCenter = getLocation(to);
			return {
				x: nodeCenter.x + radius * Math.cos(Math.PI + Math.PI / 6),
				y: nodeCenter.y - radius * Math.sin(Math.PI + Math.PI / 6)
			};
		};

		var getRightPoint = function (to) {
			var nodeCenter = getLocation(to);
			return {
				x: nodeCenter.x + radius * Math.cos(-Math.PI / 6),
				y: nodeCenter.y - radius * Math.sin(-Math.PI / 6)
			};
		};

		var getTopPoint = function (to) {
			var nodeCenter = getLocation(to);
			return {
				x: nodeCenter.x,
				y: nodeCenter.y - radius,
			};
		};

		var lastActionPerformed = -1;
		document.getElementById('nextButton').disabled = false;
		document.getElementById('nextButton').innerHTML = 'Next: ' + test.actions[lastActionPerformed + 1].name;

		document.getElementById('numberInput').disabled = false;

		nextAction = function () {
			lastActionPerformed++;
			var action = test.actions[lastActionPerformed];
			document.getElementById('nextButton').disabled = true;
			document.getElementById('numberInput').disabled = true;
			for (var i = 0; i < action.steps.length; i++) {
				(function (i) {
					window.setTimeout(function () {
						svg.selectAll('circle')
							.classed('highlighted', false);

						actionCallbacks[action.steps[i].action](action.steps[i].data);
						document.getElementById('current').innerHTML = action.name + ': ' + action.steps[i].description;
					}, i * duration);
				})(i);
			}

			if (test.actions.length !== lastActionPerformed + 1) {
				document.getElementById('nextButton').innerHTML = 'Next: ' + test.actions[lastActionPerformed + 1].name;
			} else {
				document.getElementById('nextButton').innerHTML = 'Next: none';
				document.getElementById('nextButton').disabled = true;
			}

			window.setTimeout(function () {
				svg.selectAll('circle')
					.classed('highlighted', false);
				if (test.actions.length !== lastActionPerformed + 1) {
					document.getElementById('nextButton').disabled = false;
				}
				document.getElementById('numberInput').disabled = false;
			}, i * duration);
		};

		document.getElementById('numberInput').onmousemove = document.getElementById('numberInput').onchange = function () {
			duration = parseInt(document.getElementById('numberInput').value);
			document.getElementById('numberLabel').innerHTML = duration + ' ms/step';
		};
	};

	document.getElementById('testSelect').onchange();
};