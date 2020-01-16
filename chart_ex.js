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
// 차트의 크기에 margin 값을 더해서 svg 전체 면적 결정
// x축 : margin.left, y축 : margin.top 만큼 이동시켜서 이후의 차트는 margin값과 상관없이 그리도록 함
var svg = d3.select("body")
		.append("svg")
		.attr("width", cSize.width + margin.left + margin.right)
		.attr("height", cSize.height + margin.top + margin.bottom)
		.append("g")	// 축 그룹
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 차트 제목 표시
var title = svg.append("text")
				.attr("class", "title")
				.attr("x", cSize.width / 2)
				.attr("y", -20)
				.text("[ 과목별 성적 차트 ]");

// x, y scale 함수
var x = d3.scale.ordinal()
		.rangeRoundBands([0, cSize.width], .2);
var y = d3.scale.linear()
		.domain([0,100])
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
				.domain([0,50,100])
				.range(["#f00","#dd0","#0f0"]);

// .tsv 파일에서 데이터 가져오기
d3.tsv("http://github.com/immose93/D3.js-practice/blob/master/data.tsv", type, function(error, data) {
	if(error) throw error;
	
	// domain 설정
	x.domain(data.map(function(d){ return d.classname; }));
//	y.domain([0, d3.max(data, function(d){ return d.score; })]);
//	barColor.domain([d3.min(data, function(d) { return d.score; }), d3.max(data, function(d) { return d.score; })]);
//	barColor.domain([0,50,d3.max(data, function(d) { return d.score; })]);
	
	// 축 그룹 생성 후 axis 함수 호출
	svg.append("g")
    	.attr("class", "x axis")
		.attr("transform", "translate(0," + cSize.height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("y", -20)
		.attr("dy", ".71em")
		.style("text-anchor", "left")
		.text("점수");
	
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
		.attr("x", function(d) { return x(d.classname);})
		.attr("y", function(d) { return y(d.score);})
		.attr("width", x.rangeBand() - 2)	// x의 range를 변수목록만큼 적당히 나눠준 너비값
		.attr("height", function(d) { return cSize.height - y(d.score);})
		.attr("fill", function(d) {	return barColor(d.score); }) // 색상 설정
		.on('mouseover', tip.show)	// 커서를 대면 툴팁 표시
		.on('mouseout', tip.hide);	// 커서를 빼면 툴팁 숨김
	
	// 레이블 문자열 추가
	bar.append("text")
		.attr("x",function(d) { return x(d.classname) + 2;})
		.attr("y", function(d) { return y(d.score) + 10;})
		.text(function(d){ return d.score;});
})

function type(d) {
	d.score = +d.score;
	return d;
}
