/**
 * Represents an application made up of StackViews.
 * @class
 * @param {DOMObject} container - The HTML object in which the application should place its views.
 */
var StackApplication = function(container)
{
	this.container = $(container);
	this.viewStack = [];
}

/**
 * Present a new view. Calling this function starts a new stack and throws out the old one.
 * @param {StackView} view - The view to present.
 */
StackApplication.prototype.show = function(view)
{
	// Notify old views
	if (this.viewStack.length > 0)
	{
		this.viewStack[this.viewStack.length - 1].onHide();
		for (let i in this.viewStack)
		{
			this.viewStack[i].removeFromApplication();
		}
	}
	
	// Remove old views from DOM
	this.container.empty();
		
	// Add new view to DOM
	let viewContainer = $("<div>").addClass("stack-view-container").appendTo(this.container);
	viewContainer.html(view.HTMLSource);

	// Notify new view
	view.addToApplication(this, viewContainer);
	view.onShow();
	this.viewStack = [view];
}

/**
 * Add a new view to the top of the stack.
 * @param {StackView} view - The view to push.
 * @param {Array} css - css properties to apply to container of new view
 */
StackApplication.prototype.push = function(view, css)
{
	if (this.viewStack.length > 0)
	{
		// Hide old view
		this.viewStack[this.viewStack.length - 1].onHide();
		this.container.children(".stack-view-container").hide();
	}
		
	// Add new view to DOM
	let viewContainer = $("<div>").addClass("stack-view-container").appendTo(this.container);
	if(css){ //allows subclasses to add css to container before container is shown; useful for transition animations
		for(var i=0; i<css.length; i++){
			$(viewContainer).css(css[i][0],css[i][1]);
		}
	}
	viewContainer.html(view.HTMLSource);
	
	// Notify new view
	view.addToApplication(this, viewContainer);
	view.onShow();
	this.viewStack.push(view);
	return viewContainer;
}

/**
 * Pop to the next view on the stack, optionally passing a value.
 * @param {*} returnValue - A value to pass to the view being popped to.
 */
StackApplication.prototype.pop = function(returnValue)
{
	// Notify old view
	let oldView = this.viewStack.pop()
	oldView.onHide();
	oldView.removeFromApplication();

	// Hide old view
	this.container.children(".stack-view-container").remove(":last");
	this.container.children(".stack-view-container").hide();
	
	if (this.viewStack.length > 0)
	{
		// Notify new view
		let view = this.viewStack[this.viewStack.length - 1];
		view.onPopTo(returnValue);
		view.onShow();
		
		// Show new view
		this.container.children(".stack-view-container:last").show();
		return this.container.children(".stack-view-container:last");
	}
}

