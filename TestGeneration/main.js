var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var faker = require("faker");
var fs = require("fs");
faker.locale = "en";
var mock = require('mock-fs');
var _ = require('underscore');

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
		args = ["subject.js"];
	}
	var filePath = args[0];

	constraints(filePath);

	generateTestCases()

}


function fakeDemo()
{
	console.log( faker.phone.phoneNumber() );
	console.log( faker.phone.phoneNumberFormat() );
	console.log( faker.phone.phoneFormats() );
}

var functionConstraints =
{
}

var mockFileLibrary = 
{
	pathExists:
	{
		'path/fileExists': {}
	},
	pathNotExists:
	{
	    'path/': {}
	},
	fileWithContent:
	{
		pathContent: 
		{	
  			file1: 'text content',
		}	
	},
	fileWithoutContent:
	{
		pathContent: 
		{	
  			file1: '',
		}
	}
};

function generateTestCases()
{

	var content = "var subject = require('./subject.js')\nvar mock = require('mock-fs');\n";
	for ( var funcName in functionConstraints )
	{
		var params = {};

		// initialize params
		for (var i = 0; i < functionConstraints[funcName].params.length; i++ )
		{
			var paramName = functionConstraints[funcName].params[i];
			//params[paramName] = '\'' + faker.phone.phoneNumber()+'\'';
			params[paramName] = '\'\'';
		}

		//console.log( params );

		// update parameter values based on known constraints.
		var constraints = functionConstraints[funcName].constraints;
		// Handle global constraints...
		var fileWithContent = _.some(constraints, {mocking: 'fileWithContent' });
		//var fileWithoutContent = _.some(constraints, {mocking: 'fileWithoutContent' });
		var pathExists      = _.some(constraints, {mocking: 'fileExists' });
		var pathNotExists   = _.some(constraints, {mocking: '' });
		var inc_cons1       = _.some(constraints, {value: 'undefined'});
		var inc_cons2       = _.some(constraints, {value: '0'});
		var format_1        = _.some(constraints, {value: true});
		var format_2        = _.some(constraints, {value: false});
		var areaCode        = _.some(constraints, {value: '212'});  

		for( var c = 0; c < constraints.length; c++ )
		{
			var constraint = constraints[c];
			if( params.hasOwnProperty( constraint.ident ) )
			{
				params[constraint.ident] = constraint.value;
			}
		}

		// Prepare function arguments.
		var args = Object.keys(params).map( function(k) {return params[k]; }).join(",");
		if( pathExists || fileWithContent )
		{
			content += generateMockFsTestCases(pathExists,fileWithContent,funcName, args);
			// Bonus...generate constraint variations test cases....
			content += generateMockFsTestCases(!pathExists,!fileWithContent,funcName, args);
			content += generateMockFsTestCases(pathExists,!fileWithContent,funcName, args);
			content += generateMockFsTestCases(!pathExists,fileWithContent,funcName, args);
		}
		else if (inc_cons1 || inc_cons2){
		content += "subject.{0}({1});\n".format(funcName, args );
		content += "subject.{0}({1});\n".format(funcName, "'-2','undefined'");
		content += "subject.{0}({1});\n".format(funcName, "'-1','3'");		
		}
		else if(format_1 || format_2){
		var phoneNumForm = faker.phone.phoneFormats();
		var phoneNumF = faker.phone.phoneNumberFormat();
		
		content += "subject.{0}({1});\n".format(funcName, args );
		var options = {toString: function(){return "{normalize:true}";},};
		content += "subject.{0}({1});\n".format(funcName,"'"+phoneNumF+"','"+phoneNumForm+"',"+options);
		options['toString'] = function(){return "{normalize:false}";};
		content += "subject.{0}({1});\n".format(funcName,"'"+phoneNumF+"','"+phoneNumForm+"',"+options);
		content += "subject.{0}({1});\n".format(funcName,"'"+phoneNumF+"','"+phoneNumForm+"',"+!options);
		}
		else if(!areaCode)
		{
		var phoneNum = faker.phone.phoneNumberFormat();
		content += "subject.{0}({1});\n".format(funcName, args);
		content += "subject.{0}({1});\n".format(funcName, "'(212) 234-5644'");
		content += "subject.{0}({1});\n".format(funcName, "'"+phoneNum+"'" );
		}
		else{
			// Emit simple test case.
			content += "subject.{0}({1});\n".format(funcName, args );
			//content += "subject.{0}({1});\n".format(funcName, 'undefined','-2');
		}
	}
	fs.writeFileSync('test.js', content, "utf8");
}

function generateMockFsTestCases (pathExists,fileWithContent,funcName,args) 
{
	var testCase = "";
	// Insert mock data based on constraints.
	var mergedFS = {};
	if( pathExists )
	{
		for (var attrname in mockFileLibrary.pathExists) { mergedFS[attrname] = mockFileLibrary.pathExists[attrname]; }
	}
	if( fileWithContent )
	{
       	console.log('fileWithContent'+fileWithContent);
		for (var attrname in mockFileLibrary.fileWithContent) { mergedFS[attrname] = mockFileLibrary.fileWithContent[attrname]; }		
	}
	if( !fileWithContent )
	{
		console.log('fileWithContent1'+fileWithContent);
		for (var attrname in mockFileLibrary.fileWithoutContent) { mergedFS[attrname] = mockFileLibrary.fileWithoutContent[attrname]; }
	}
//	if( !pathExists )
//	{
//		for (var attrname in mockFileLibrary.pathNotExists) { mergedFS[attrname] = mockFileLibrary.pathNotExists[attrname]; }
//	}

	testCase += 
	"mock(" +
		JSON.stringify(mergedFS)
		+
	");\n";

	testCase += "\tsubject.{0}({1});\n".format(funcName, args );
	testCase+="mock.restore();\n";
	return testCase;
}

function constraints(filePath)
{
   var buf = fs.readFileSync(filePath, "utf8");
	var result = esprima.parse(buf, options);

	traverse(result, function (node) 
	{
		if (node.type === 'FunctionDeclaration') 
		{
			var funcName = functionName(node);
			console.log("Line : {0} Function: {1}".format(node.loc.start.line, funcName ));

			var params = node.params.map(function(p) {return p.name});

			functionConstraints[funcName] = {constraints:[], params: params};

			// Check for expressions using argument.
			traverse(node, function(child)
			{
				if( child.type == 'BinaryExpression' && child.operator == "==")
				{
					if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) > -1)
					{
						// get expression from original source code:
						//var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])
						functionConstraints[funcName].constraints.push( 
							{
								ident: child.left.name,
								value: rightHand
							});
					}
				}

				if( child.type == 'BinaryExpression' && child.operator == "<")
				{
					if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) > -1)
					{
						// get expression from original source code:
						//var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])
						functionConstraints[funcName].constraints.push( 
							{
								ident: child.left.name,
								value: rightHand
							});
					}
				}
				
				if( child.type == 'LogicalExpression' && 
				    child.operator=="||")
                {
                    if(child.left.type=='UnaryExpression')
                    {
                        functionConstraints[funcName].constraints.push(
                        {
                            ident: child.left.argument.name,
                            value: true,
                        }
                        )
                        functionConstraints[funcName].constraints.push(
                        {
                            ident: child.left.argument.name,
                            value: false,
                        }
                        );
                    }
     
                if(child.right.type=='UnaryExpression' &&
				    child.right.operator == "!"){
                    if(child.right.argument.type=='MemberExpression'){
						functionConstraints[funcName].constraints.push(
                        {
							ident: child.right.argument.object.name+'.'+child.right.argument.property.name,
							value: true,
                        }
                        )
                        functionConstraints[funcName].constraints.push(
                        {
                            ident: child.right.argument.object.name+'.'+child.right.argument.property.name,
                            value: false,
                        }
                        );
                    }
                }
            }
				
				if( child.type == "CallExpression" && 
					 child.callee.property &&
					 child.callee.property.name =="readFileSync" )
				{
					for( var p =0; p < params.length; p++ )
					{
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							{
								// A fake path to a file
								ident: params[p],
								value: "'pathContent/file1'",
								mocking: 'fileWithContent'
							});
						}
					}
				}
				
					
				if( child.type == "CallExpression" &&
					 child.callee.property &&
					 child.callee.property.name =="existsSync")
				{
					    console.log(params+"Hello parama");
					for( var p =0; p < params.length; p++ )
					{
					    	    console.log(params[p]+"Hello p");
					    console.log(child.arguments[0].name+"Hello arg");
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							{
								// A fake path to a file
								ident: params[p],
								value: "'path/fileExists'",
								mocking: 'fileExists'
							});
						}
						
					}
				}

			});

			console.log( functionConstraints[funcName]);

		}
	});
}

function traverse(object, visitor) 
{
    var key, child;

    visitor.call(null, object);
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function traverseWithCancel(object, visitor)
{
    var key, child;

    if( visitor.call(null, object) )
    {
	    for (key in object) {
	        if (object.hasOwnProperty(key)) {
	            child = object[key];
	            if (typeof child === 'object' && child !== null) {
	                traverseWithCancel(child, visitor);
	            }
	        }
	    }
 	 }
}

function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "";
}


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();