from django.test import SimpleTestCase

from .services.domain_guard import classify_topic


class DomainGuardTests(SimpleTestCase):
    def test_allows_retinal_and_website_questions(self):
        allowed = [
            'What is diabetic retinopathy?',
            'What are microaneurysms?',
            'What is a hard exudate?',
            'What does Grad-CAM mean?',
            'How does lesion detection work?',
            'How do I upload an image?',
            'How can I download the report?',
        ]
        for message in allowed:
            with self.subTest(message=message):
                self.assertNotEqual(classify_topic(message), 'blocked')

    def test_blocks_unrelated_questions(self):
        blocked = [
            'What is Instagram?',
            'Tell me a joke.',
            'Who won the cricket match?',
            'Write a Python program.',
            'What is Bitcoin?',
            'Give me a recipe.',
            'Tell me about politics.',
        ]
        for message in blocked:
            with self.subTest(message=message):
                self.assertEqual(classify_topic(message), 'blocked')

    def test_uses_conversation_context(self):
        self.assertNotEqual(
            classify_topic('What are its stages?', ['Diabetic retinopathy is a disease of the retina.']),
            'blocked',
        )

    def test_mixed_intent_is_evaluated_by_context(self):
        self.assertNotEqual(
            classify_topic('What is diabetic retinopathy and can I post about it on Instagram?'),
            'blocked',
        )