var MapDict = {
	
	testMap:
	{

		assets:
		{

			sprite:
			[

			],

			texture:
			[
				"dungeon1"
			],

			terrain:
			[
				"nature1"
			]

		},

		levels:
		[

			{
				
				testRoom:
				{
					
					aliases:
					{
						A: "nature1"
					},
					backdrop: "#003721",
					entities: 
					[

					],
					layers:
					[

						{

							cols: 4,
							rows: 4,
							tiles:
							[

								Array.prototype.concat(
									"A:0,2", "A:3,2", "A:1,2", "A:1,2",
									"A:1,2", "A:2,2", "A:2,2", "A:1,2",
									"A:4,2", "A:4,1", "A:1,2", "A:6,2",
									"A:4,1", "A:5,1", "", "")

							],
							objects:
							[
								
								{
									name: "objectName",
									image: "",
									position:
									{
										x: 0,
										y: 0
									}

								}

							]

						}

					]

				}

			}
			
		]

	}

};