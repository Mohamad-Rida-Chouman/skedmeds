import 'package:flutter/material.dart';

class PharmacyScreen extends StatefulWidget {
  @override
  _PharmacyScreenState createState() => _PharmacyScreenState();
}

class Item {
  final String title;
  final String description;
  final double price;

  Item({
    required this.title,
    required this.description,
    required this.price,
  });
}

class _PharmacyScreenState extends State<PharmacyScreen> {
  final List<Item> _items = [
    Item(
      title: "Paracetamol",
      description: "Used to relieve pain and fever.",
      price: 5.99,
    ),
    Item(
      title: "Ibuprofen",
      description: "Used to relieve pain, fever, and inflammation.",
      price: 7.49,
    ),
    Item(
      title: "Aspirin",
      description: "Used to relieve pain, fever, and inflammation.",
      price: 3.25,
    ),
    Item(
      title: "Loratadine",
      description:
          "Used to relieve allergy symptoms such as sneezing, runny nose, itchy eyes, and hives.",
      price: 8.99,
    ),
    Item(
      title: "Cetirizine",
      description:
          "Used to relieve allergy symptoms such as sneezing, runny nose, itchy eyes, and hives.",
      price: 6.75,
    ),
    Item(
      title: "Omeprazole",
      description: "Used to treat and prevent stomach ulcers and heartburn.",
      price: 12.50,
    ),
    Item(
      title: "Amoxicillin",
      description:
          "An antibiotic used to treat a variety of bacterial infections.",
      price: 15.99,
    ),
    Item(
      title: "Metformin",
      description: "Used to treat type 2 diabetes.",
      price: 9.25,
    ),
    Item(
      title: "Simvastatin",
      description: "Used to lower cholesterol levels.",
      price: 18.75,
    ),
    Item(
      title: "Salbutamol",
      description:
          "Used to treat and prevent asthma symptoms such as wheezing, shortness of breath, chest tightness, and coughing.",
      price: 11.99,
    ),
  ];

  List<Item> _displayedItems = []; // Items displayed based on search
  String _searchText = ""; // Stores the current search text

  List<Item> _cartItems = []; // List of items in the cart
  double _totalPrice = 0.0; // Total price of items in the cart

  @override
  void initState() {
    super.initState();
    _displayedItems = _items; // Initially display all items
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: TextField(
          style:
              TextStyle(color: Colors.white), // Set text color for user input
          // Search bar
          decoration: InputDecoration(
            hintStyle: TextStyle(color: Colors.white), // Set label text color
            hintText: "Search medicines...",
            prefixIcon: Icon(Icons.search),
            prefixIconColor: Colors.white,
            enabledBorder: UnderlineInputBorder(
              // Use UnderlineInputBorder
              borderSide: BorderSide(color: Colors.white), // White border
            ),
            focusedBorder: UnderlineInputBorder(
              // Use UnderlineInputBorder for focus
              borderSide:
                  BorderSide(color: Colors.white), // White border for focus
            ),
          ),
          onChanged: (text) {
            setState(() {
              _searchText = text;
              _displayedItems = _items
                  .where((item) => item.title
                      .toLowerCase()
                      .contains(_searchText.toLowerCase()))
                  .toList();
            });
          },
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.shopping_cart, color: Colors.white), // Cart icon
            onPressed: () => _showCartModal(),
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: _displayedItems.length,
        itemBuilder: (context, index) {
          final item = _displayedItems[index];
          return PharmacyItemCard(item: item, onAddToCart: _addToCart);
        },
      ),
    );
  }

  void _addToCart(Item item) {
    setState(() {
      _cartItems.add(item);
      _totalPrice += item.price;
    });
  }

  void _removeFromCart(Item item) {
    setState(() {
      _cartItems.remove(item);
      _totalPrice -= item.price;
    });
  }

  void _showCartModal() {
    showModalBottomSheet(
      context: context,
      builder: (context) => _buildCartModalContent(),
    );
  }

  Widget _buildCartModalContent() {
    if (_cartItems.isEmpty) {
      return Center(child: Text("Your cart is empty."));
    }

    return Column(
      mainAxisSize: MainAxisSize.min, // Set minimum modal height
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Cart Items", style: TextStyle(fontSize: 18.0)),
              Text("Total: \$" + _totalPrice.toStringAsFixed(2)),
            ],
          ),
        ),
        Divider(),
        ListView.builder(
          // Adjust max height for scrollable content if needed
          shrinkWrap: true, // Wrap content vertically
          itemCount: _cartItems.length,
          itemBuilder: (context, index) {
            final item = _cartItems[index];
            return ListTile(
              title: Text(item.title),
              subtitle: Text("Price: \$" + item.price.toStringAsFixed(2)),
              trailing: IconButton(
                icon: Icon(Icons.delete),
                onPressed: () => _removeFromCart(item),
              ),
            );
          },
        ),
      ],
    );
  }
}

class PharmacyItemCard extends StatelessWidget {
  final Item item;
  final Function(Item) onAddToCart;

  const PharmacyItemCard({required this.item, required this.onAddToCart});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          children: [
            SizedBox(width: 16.0),
            Expanded(
              // Wrap description text
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.title, style: TextStyle(fontSize: 16.0)),
                  Text(
                    item.description, // Wrap description
                    maxLines: 3, // Limit lines displayed
                    overflow: TextOverflow.ellipsis, // Add ellipsis (...)
                  ),
                  Text("Price: \$" + item.price.toStringAsFixed(2)),
                  ElevatedButton(
                    onPressed: () => onAddToCart(item),
                    child: Text("Add to Cart"),
                    style: TextButton.styleFrom(
                      foregroundColor:
                          Colors.white, // Text color for button (optional)
                      backgroundColor: Color(0xFF38B3CD),
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(4.0), // Set rounded corners
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
