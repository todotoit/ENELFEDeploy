# sidebarDonutChart



### Size

The viewBox is 300x300. You can change it in template.


### Dependencies

- d3.js



### Include

- sidebarDonutChart.css
- sidebarDonutChart.js



### Usage

Init passing the container and the initial dataset:
	
	var data = [20, 34, 54, 6, 7]
	var myDonut = new sidebarDonutChart('container', data)

Update its status passing the updated dataset:

	myDonut.update(newdata)

Listen for arc click and get the local datum object:

	myDonut.onSelected(function(d){
        console.log(d)
    })