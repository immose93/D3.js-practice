// chart 크기 설정
var cSize = {
	width: 800,
	height: 400
}

// margin 설정
var margin = {
	top: 50,
	right: 50,
	bottom: 30,
	left: 50
}

// svg 생성
// chart의 크기에 margin 값을 더해서 svg 전체 면적 결정
// x축 : margin.left, y축 : margin.top 만큼 이동시켜서 이후의 차트는 margin값과 상관없이 그리도록 함
var svg = d3.select("body")
		.append("svg")
		.attr("width", cSize.width + margin.left + margin.right)
		.attr("height", cSize.height + margin.top + margin.bottom)
		.append("g")	// 그룹
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 차트 제목 표시
var title = svg.append("text")
				.attr("class", "title")
				.attr("x", cSize.width / 2)
				.attr("y", -20)
				.text("[ 제품 품질 차트 ]");

// x, y scale 함수
var x = d3.scale.ordinal()
		.rangeRoundBands([0, cSize.width], .2);
var y = d3.scale.linear()
		.range([cSize.height,0]);

// x축 생성 함수
var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")	// 눈금 위치
			.outerTickSize(1);	// 선 두께

// y축 생성 함수
var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")		// 눈금 위치
			.outerTickSize(1)	// 선 두께
			.innerTickSize(-cSize.width);	// 차트 안쪽으로의 눈금 생성

// bar 색상 함수 (data 값에 따라 선형적으로 변화)
var barColor = d3.scale.linear()
				.range(["#f00","#dd0","#0f0"]);

// .tsv 파일에서 데이터 가져오기
d3.tsv("data.tsv", type, function(error, data) {
	if(error) {
		var errMsg = svg.append("text")
						.attr("class", "errMsg")
						.attr("x", 0)
						.attr("y", 100)
						.text("데이터를 불러오는 데 실패했습니다.");
	}
	
	// domain 설정
	var minValue = d3.min(data, function(d){ return d.score;}),
		maxValue = d3.max(data, function(d){ return d.score;}),
		average = d3.mean(data, function(d){ return d.score;});
	x.domain(data.map(function(d){ return d.productName; }));
	y.domain([0,maxValue]);
	barColor.domain([minValue,average,maxValue]);
	
	// 축 그룹 생성 후 axis 함수 호출
	svg.append("g")
    	.attr("class", "x axis")
		.attr("transform", "translate(0," + cSize.height + ")")
		.call(xAxis)
		.append("text")
		.attr("x", cSize.width)
		.attr("y", 20)
		.text("제품명");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("y", -20)
		.attr("dy", ".71em")
		.style("text-anchor", "left")
		.text("품질 점수");
	
	// 툴팁 추가
	var tip = d3.tip()
				.attr("class", "d3-tip")
				.offset([10,0])
				.html(function(d) { return "<span style='color:" + barColor(d.score) + "'>" + d.score + "점"; });
	svg.call(tip);
	
	// bar 그룹
	var bar = svg.selectAll(".bar")
				.data(data)
				.enter()
				.append("g")
				.attr("class", "bar");
	
	// 그래프 막대
	bar.append("rect")
		.attr("x", function(d) { return x(d.productName);})
		.attr("y", function(d) { return y(d.score);})
		.attr("width", x.rangeBand() - 2)	// x의 range를 변수목록만큼 적당히 나눠준 너비값
		.attr("height", function(d) { return cSize.height - y(d.score);})
		.attr("fill", function(d) {	return barColor(d.score); }) // 색상 설정
		.on('mouseover', tip.show)	// 커서를 대면 툴팁 표시
		.on('mouseout', tip.hide);	// 커서를 빼면 툴팁 숨김
	
	// 레이블 문자열 추가
	bar.append("text")
		.attr("x",function(d) { return x(d.productName) + 2;})
		.attr("y", function(d) { return y(d.score) + 10;})
		.text(function(d){ return d.score;});
})

function type(d) {
	d.score = +d.score;
	return d;
}
