from __future__ import absolute_import, division
from __future__ import print_function, unicode_literals

from tensorflow.keras import datasets, layers, models
import tensorflowjs as tfjs
import os

(train_images, train_labels), (test_images,
                               test_labels) = datasets.mnist.load_data()

train_images = train_images.reshape((60000, 28, 28, 1))
test_images = test_images.reshape((10000, 28, 28, 1))

# Normalize pixel values to be between 0 and 1
train_images, test_images = train_images / 255.0, test_images / 255.0

model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(10, activation='softmax')
])
# model.summary()

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(train_images, train_labels, epochs=10)

test_loss, test_acc = model.evaluate(test_images, test_labels)
print("The Loss is", test_loss, "And the Testing Accuracy is", test_acc)

print("Model saving..")

model.save('../model/cnn/cnn.model')

if os.path.exists("../model/cnn/json"):
    os.remove("../model/cnn/json/model.json")
tfjs.converters.save_keras_model(model, '../model/cnn/json')

print("Model saved as 'cnn.model'")
