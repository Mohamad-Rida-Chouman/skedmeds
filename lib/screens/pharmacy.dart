import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class Item {
  final String name;
  final String description;
  final double price;

  Item({
    required this.name,
    required this.description,
    required this.price,
  });

  factory Item.fromFirestore(Map<String, dynamic> data) => Item(
        name: data['name'] as String,
        description: data['description'] as String,
        price: (data['price'] as num).toDouble(),
      );

  Map<String, dynamic> toMap() => {
        'name': name,
        'description': description,
        'price': price,
      };
}

class PharmacyScreen extends StatefulWidget {
  @override
  _PharmacyScreenState createState() => _PharmacyScreenState();
}

class _PharmacyScreenState extends State<PharmacyScreen> {
  List<Item> _items = [];
  List<Item> _displayedItems = [];
  String _searchText = "";

  final firestoreInstance = FirebaseFirestore.instance;
  final medicinesCollection =
      FirebaseFirestore.instance.collection("medicines");
  final FirebaseAuth _auth = FirebaseAuth.instance;
  // final String _cartCollectionName = "carts"; // Name of cart collection

  final _cartItems = <Item>[]; // Cart items list
  double _totalPrice = 0.0; // Total price

  @override
  void initState() {
    super.initState();
    _getCurrentUser();
    _fetchData();
    _loadCartItems(); // Load cart items on app launch
  }

  void _getCurrentUser() async {
    final user = _auth.currentUser;
    if (user != null) {
      // Get cart document reference based on user ID
      final cartRef = _getCartReference(user.uid); // Replace with your logic

      // Optional: Attach listener for cart updates from other devices
      // This requires additional logic to handle updates
      // streamSubscription = cartRef.snapshots().listen((snapshot) {
      //   if (snapshot.exists) {
      //     final data = snapshot.data()!;
      //     _cartItems.clear();
      //     _cartItems.addAll(
      //         (data['items'] as List).map((item) => Item.fromFirestore(item)).toList());
      //     _calculateTotalPrice(); // Recalculate total price on cart update
      //     setState(() {}); // Trigger rebuild after updating cart
      //   }
      // });
    } else {
      print("No user signed in, cart persistence unavailable.");
    }
  }

  DocumentReference<Map<String, dynamic>> _getCartReference(String userId) {
    // Choose the approach that best suits your application's data structure and access needs:

    // 1. Subcollection within the user document:
    return FirebaseFirestore.instance
        .collection('users')
        .doc(userId)
        .collection('cart')
        .doc();

    // 2. Separate collection with a unique identifier for each cart:
    // final cartId = '${Uuid().v4()}';  // Consider using a more robust method
    // return FirebaseFirestore.instance.collection('carts').doc(cartId);
  }

  void _fetchData() async {
    try {
      final querySnapshot = await medicinesCollection.get();
      if (querySnapshot.docs.isNotEmpty) {
        for (var doc in querySnapshot.docs) {
          final item = Item.fromFirestore(doc.data());
          _items.add(item);
        }
        _displayedItems.addAll(_items); // Initially display all medicines
        setState(() {}); // Trigger rebuild after updating state
      } else {
        // Handle empty data case (display a message or placeholder)
      }
    } catch (error) {
      print("Error fetching medicines: $error");
    }
  }

  void _addToCart(Item item) {
    setState(() {
      _cartItems.add(item);
      _calculateTotalPrice();
      _saveCartItems(); // Save cart items to Firestore
    });
  }

  void _removeFromCart(Item item) {
    setState(() {
      _cartItems.remove(item);
      _calculateTotalPrice();
      _saveCartItems(); // Save cart items to Firestore
    });
  }

  void _calculateTotalPrice() {
    _totalPrice = _cartItems.fold(0.0, (sum, item) => sum + item.price);
  }

  void _saveCartItems() async {
    final user = _auth.currentUser;
    if (user == null) {
      print("No user signed in, cart cannot be saved.");
      return;
    }

    // Get cart document reference based on user ID (replace with your logic)
    final cartRef = _getCartReference(user.uid);

    // Convert cart items to a map suitable for Firestore
    final cartData = {'items': _cartItems.map((item) => item.toMap()).toList()};
    await cartRef.set(cartData);
  }

  void _loadCartItems() async {
    final user = _auth.currentUser;
    if (user == null) {
      print("No user signed in, cart cannot be loaded.");
      return;
    }

    // Get cart document reference based on user ID (replace with your logic)
    final cartRef = _getCartReference(user.uid);

    final docSnapshot = await cartRef.get();
    if (!docSnapshot.exists) {
      _cartItems.clear(); // Clear existing items if no cart document found
      setState(() {}); // Trigger rebuild after updating state
      return;
    }

    final data = docSnapshot.data()!;
    final cartItems = (data['items'] as List)
        .map((item) => Item.fromFirestore(item))
        .toList();
    _cartItems.clear();
    _cartItems.addAll(cartItems);
    _calculateTotalPrice(); // Recalculate total price on cart load
    setState(() {}); // Trigger rebuild after updating state
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: TextField(
          style: TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintStyle: TextStyle(color: Colors.white),
            hintText: "Search medicines...",
            prefixIcon: Icon(Icons.search),
            prefixIconColor: Colors.white,
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.white),
            ),
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.white),
            ),
          ),
          onChanged: (text) {
            setState(() {
              _searchText = text;
              _displayedItems = _items
                  .where((item) => item.name
                      .toLowerCase()
                      .contains(_searchText.toLowerCase()))
                  .toList();
            });
          },
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.shopping_cart, color: Colors.white),
            onPressed: () => _showCartModal(),
          ),
        ],
      ),
      body: _items.isEmpty
          ? Center(child: Text('No medicines found.')) // Handle empty data case
          : ListView.builder(
              itemCount: _displayedItems.length,
              itemBuilder: (context, index) {
                final item = _displayedItems[index];
                return PharmacyItemCard(
                  item: item,
                  onAddToCart: () => _addToCart(item),
                );
              },
            ),
    );
  }

  void _showCartModal() {
    showModalBottomSheet(
      context: context,
      builder: (context) => _buildCartModalContent(context),
    );
  }

  Widget _buildCartModalContent(BuildContext context) {
    if (_cartItems.isEmpty) {
      return Center(child: Text("Your cart is empty."));
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Cart Items", style: TextStyle(fontSize: 18.0)),
              Text(
                "Total: \$" +
                    _totalPrice.toStringAsFixed(2), // Corrected formatting
              ),
            ],
          ),
        ),
        Divider(),
        ListView.builder(
          shrinkWrap: true,
          itemCount: _cartItems.length,
          itemBuilder: (context, index) {
            final item = _cartItems[index];
            return ListTile(
              title: Text(item.name),
              subtitle: Text(
                "Price: \$" +
                    item.price.toStringAsFixed(2), // Corrected formatting
              ),
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
  final VoidCallback onAddToCart;

  const PharmacyItemCard({
    required this.item,
    required this.onAddToCart,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              item.name,
              style: TextStyle(fontSize: 16.0),
            ),
            Text(
              item.description,
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
            Text("Price: \$" + item.price.toStringAsFixed(2)),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: onAddToCart,
                  child: Text("Add to Cart"),
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: Color(0xFF38B3CD),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(4.0),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
